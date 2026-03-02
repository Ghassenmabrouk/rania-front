import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApplicationService } from '../services/application.service';
import { ProgramService } from '../services/program.service';

interface Application {
  _id: string;
  programName: string;
  status: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
  submissionDate: string;
  description: string;
  documents?: Array<{ name: string; url: string }>;
}

@Component({
  selector: 'app-applicant-dashboard',
  templateUrl: './applicant-dashboard.component.html',
  styleUrls: ['./applicant-dashboard.component.css']
})
export class ApplicantDashboardComponent implements OnInit {
  username: string | null = localStorage.getItem('username');
  userId: string | null = localStorage.getItem('userId');
  userEmail: string = localStorage.getItem('email') || 'applicant@example.com';
  userPhone: string | null = null;

  totalApplications: number = 0;
  acceptedApplications: number = 0;
  underReviewCount: number = 0;
  totalDocuments: number = 0;

  availablePrograms: any[] = [];
  applications: Application[] = [];

  constructor(
    private http: HttpClient,
    public router: Router,
    private applicationService: ApplicationService,
    private programService: ProgramService
  ) {}

  ngOnInit(): void {
    this.loadApplicantData();
  }

  loadApplicantData(): void {
    if (this.userId) {
      this.applicationService.getApplicantApplications(this.userId).subscribe({
        next: (response) => {
          this.applications = response.data || [];
          this.totalApplications = this.applications.length;
          this.acceptedApplications = this.applications.filter(app => app.status === 'Accepted').length;
          this.underReviewCount = this.applications.filter(app => app.status === 'Under Review').length;
          this.totalDocuments = this.applications.reduce((sum, app) => sum + (app.documents ? app.documents.length : 0), 0);
        },
        error: (error) => console.error('Error loading applications:', error)
      });
    }

    this.programService.getAllPrograms().subscribe({
      next: (response) => {
        this.availablePrograms = response.data || [];
      },
      error: (error) => console.error('Error loading programs:', error)
    });
  }


  viewApplicationDetails(applicationId: string): void {
    const app = this.applications.find(a => a._id === applicationId);
    if (app) {
      this.showDetailsDialog(app);
      return;
    }
    this.applicationService.getApplicationById(applicationId).subscribe({
      next: (response) => {
        this.showDetailsDialog(response.data);
      },
      error: (error) => console.error('Error loading application details:', error)
    });
  }

  async editApplication(applicationId: string): Promise<void> {
    const app = this.applications.find(a => a._id === applicationId);
    if (app) {
      await this.showApplicationForm(app);
    } else {
      // fetch and then show
      this.applicationService.getApplicationById(applicationId).subscribe({
        next: async (res) => {
          await this.showApplicationForm(res.data);
        },
        error: (err) => {
          Swal.fire('Error', 'Unable to load application for editing', 'error');
        }
      });
    }
  }

  async uploadDocuments(): Promise<void> {
    const result = await Swal.fire({
      title: 'Upload Documents',
      text: 'Proceed to the document upload page?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
    if (result.isConfirmed) {
      this.router.navigate(['/upload-documents']);
    }
  }

  async viewAllPrograms(): Promise<void> {
    const result = await Swal.fire({
      title: 'View Programs',
      text: 'Would you like to see all available programs?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Show programs',
      cancelButtonText: 'Later'
    });
    if (result.isConfirmed) {
      this.router.navigate(['/programs']);
    }
  }

  deleteApplication(applicationId: string): void {
    Swal.fire({
      title: 'Delete application?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(res => {
      if (res.isConfirmed) {
        this.applicationService.deleteApplication(applicationId).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Application has been removed', 'success');
            this.loadApplicantData();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'Failed to delete application', 'error');
          }
        });
      }
    });
  }

  async editProfile(): Promise<void> {
    const result = await Swal.fire({
      title: 'Edit Profile',
      text: 'Open profile editor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
    if (result.isConfirmed) {
      this.router.navigate(['/edit-profile']);
    }
  }

  // display read-only details with optional edit option
  private showDetailsDialog(app: Application): void {
    let html = `<p><strong>Program:</strong> ${app.programName}</p>`;
    html += `<p><strong>Status:</strong> ${app.status}</p>`;
    html += `<p><strong>Submitted:</strong> ${new Date(app.submissionDate).toLocaleString()}</p>`;
    html += `<p><strong>Description:</strong><br/>${app.description || '<em>none</em>'}</p>`;
    if (app.documents && app.documents.length) {
      html += '<p><strong>Documents:</strong><ul>';
      app.documents.forEach(d => {
        html += `<li><a href="${d.url}" target="_blank">${d.name}</a></li>`;
      });
      html += '</ul></p>';
    }

    Swal.fire({
      title: 'Application Details',
      html,
      showCancelButton: true,
      confirmButtonText: app.status === 'Pending' ? 'Edit' : 'Close',
      cancelButtonText: 'Close',
      preConfirm: () => true
    }).then(result => {
      if (result.isConfirmed && app.status === 'Pending') {
        this.editApplication(app._id);
      }
    });
  }

  // show creation/edit form (using SweetAlert)
  private async showApplicationForm(existing?: any): Promise<void> {
    if (existing) {
      const conf = await Swal.fire({
        title: 'Edit Application',
        text: 'You are about to edit your application. Continue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, edit',
        cancelButtonText: 'Cancel'
      });
      if (!conf.isConfirmed) {
        return;
      }
    }

    if (this.availablePrograms.length === 0) {
      await new Promise<void>((resolve) => {
        this.programService.getAllPrograms().subscribe({
          next: (response) => {
            this.availablePrograms = response.data || [];
            resolve();
          },
          error: () => resolve()
        });
      });
    }
    const programOptions = this.availablePrograms.map(p => {
      let sel = '';
      if (existing) {
        const pid = existing.programId && (existing.programId._id || existing.programId);
        if (pid === p._id) sel = 'selected';
      }
      return `<option value="${p._id}" ${sel}>${p.name}</option>`;
    }).join('');

    const { value: formValues } = await Swal.fire({
      title: existing ? 'Edit Application' : 'New Application',
      html:
        '<label for="swal-program" style="display:block; text-align:left; margin-bottom:5px;">Program:</label>' +
        `<select id="swal-program" class="swal2-select">${programOptions}</select>` +
        '<label for="swal-desc" style="display:block; text-align:left; margin-top:10px; margin-bottom:5px;">Description / Motivation:</label>' +
        `<textarea id="swal-desc" class="swal2-textarea" placeholder="Why are you applying? (optional)">${existing ? existing.description : ''}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: existing ? 'Update Application' : 'Submit Application',
      preConfirm: () => {
        const programId = (document.getElementById('swal-program') as HTMLSelectElement).value;
        const description = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        if (!programId) {
          Swal.showValidationMessage('Please select a program');
          return null;
        }
        return { programId, description };
      }
    });

    if (formValues) {
      Swal.fire({ title: existing ? 'Updating...' : 'Submitting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const applicantId = localStorage.getItem('userId');
      if (existing) {
        this.applicationService.updateApplication(existing._id, { programId: formValues.programId, description: formValues.description }).subscribe({
          next: () => {
            Swal.fire('Success!', 'Application updated.', 'success');
            this.loadApplicantData();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'Failed to update application.', 'error');
          }
        });
      } else {
        this.applicationService.createApplication({ applicantId, programId: formValues.programId, description: formValues.description }).subscribe({
          next: async (res) => {
            Swal.fire('Success!', 'Your application has been submitted.', 'success');
            this.loadApplicantData();
            const appId = res.data?._id;
            const uploadPrompt = await Swal.fire({
              title: 'Upload Documents',
              text: 'Would you like to upload supporting documents now?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'Later'
            });
            if (uploadPrompt.isConfirmed) {
              this.router.navigate(['/upload-documents'], { queryParams: { applicationId: appId } });
            }
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'Failed to submit application.', 'error');
          }
        });
      }
    }
  }
}
