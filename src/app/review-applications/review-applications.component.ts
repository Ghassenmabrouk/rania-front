import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApplicationService } from '../services/application.service';

interface ReviewApplication {
  _id: string;
  applicantName: string;
  applicantEmail: string;
  programName: string;
  status: string;
  submissionDate: string;
  description: string;
  reviewNotes: string;
  decisionReason?: string;
  decisionDate?: string;
}

@Component({
  selector: 'app-review-applications',
  templateUrl: './review-applications.component.html',
  styleUrls: ['./review-applications.component.css']
})
export class ReviewApplicationsComponent implements OnInit {
  allApplications: ReviewApplication[] = [];
  filteredApplications: ReviewApplication[] = [];
  loading = false;
  activeTab = 'All';
  searchTerm = '';
  currentUserId = localStorage.getItem('userId') || '';

  tabs = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Under Review', value: 'Under Review' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAllApplications().subscribe({
      next: (response: any) => {
        const applications = response.data || [];
        this.allApplications = applications.map((app: any) => ({
          _id: app._id,
          applicantName: app.applicantName,
          applicantEmail: app.applicantEmail,
          programName: app.programName,
          status: app.status,
          submissionDate: new Date(app.submissionDate).toLocaleDateString(),
          description: app.description || '',
          reviewNotes: app.reviewNotes || '',
          decisionDate: app.reviewDate ? new Date(app.reviewDate).toLocaleDateString() : undefined
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading applications:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load applications', 'error');
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.allApplications.filter(app => {
      const matchesTab = this.activeTab === 'All' || app.status === this.activeTab;
      const matchesSearch = app.applicantName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.programName.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });

    this.filteredApplications = filtered.sort((a, b) =>
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Accepted':
        return '#28a745';
      case 'Rejected':
        return '#dc3545';
      case 'Under Review':
        return '#0066cc';
      case 'Pending':
        return '#f39c12';
      default:
        return '#999';
    }
  }

  getStatusBgColor(status: string): string {
    switch (status) {
      case 'Accepted':
        return '#d4edda';
      case 'Rejected':
        return '#f8d7da';
      case 'Under Review':
        return '#d1e7ff';
      case 'Pending':
        return '#fff3cd';
      default:
        return '#e9ecef';
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'Accepted':
        return '#155724';
      case 'Rejected':
        return '#721c24';
      case 'Under Review':
        return '#004085';
      case 'Pending':
        return '#856404';
      default:
        return '#495057';
    }
  }

  getTabCount(tab: string): number {
    if (tab === 'All') {
      return this.allApplications.length;
    }
    return this.allApplications.filter(app => app.status === tab).length;
  }

  viewApplicationDetails(application: ReviewApplication): void {
    Swal.fire({
      title: application.applicantName,
      html: `
        <div style="text-align: left; padding: 20px;">
          <p><strong>Email:</strong> ${application.applicantEmail}</p>
          <p><strong>Program:</strong> ${application.programName}</p>
          <p><strong>Submission Date:</strong> ${application.submissionDate}</p>
          <p><strong>Status:</strong> <span style="background: ${this.getStatusColor(application.status)}; padding: 3px 8px; border-radius: 12px; color: white;">${application.status}</span></p>
          <p><strong>Application Notes:</strong></p>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 5px;">${application.description || 'No additional notes'}</p>
          ${application.reviewNotes ? `<p><strong>Review Notes:</strong></p><p style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 5px;">${application.reviewNotes}</p>` : ''}
          ${application.decisionDate ? `<p><strong>Decision Date:</strong> ${application.decisionDate}</p>` : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#123777'
    });
  }

  async acceptApplication(application: ReviewApplication): Promise<void> {
    if (application.status === 'Accepted') {
      await Swal.fire('Info', 'This application is already accepted', 'info');
      return;
    }

    const { value: reason } = await Swal.fire({
      title: 'Accept Application?',
      input: 'text',
      inputLabel: 'Acceptance Reason (optional)',
      inputPlaceholder: 'e.g., Strong academic credentials and relevant experience',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745'
    });

    if (reason !== undefined) {
      this.applicationService.updateApplicationStatus(
        application._id,
        {
          status: 'Accepted',
          reviewNotes: reason || 'Accepted based on application review',
          reviewedBy: this.currentUserId
        }
      ).subscribe({
        next: () => {
          Swal.fire('Success', `Application from ${application.applicantName} has been accepted`, 'success');
          this.loadApplications();
        },
        error: (error: any) => {
          console.error('Error accepting application:', error);
          Swal.fire('Error', 'Failed to accept application', 'error');
        }
      });
    }
  }

  async rejectApplication(application: ReviewApplication): Promise<void> {
    if (application.status === 'Rejected') {
      await Swal.fire('Info', 'This application is already rejected', 'info');
      return;
    }

    const { value: reason } = await Swal.fire({
      title: 'Reject Application?',
      input: 'text',
      inputLabel: 'Rejection Reason (required)',
      inputPlaceholder: 'e.g., Does not meet minimum GPA requirement',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      inputValidator: (value) => {
        if (!value) {
          return 'Rejection reason is required';
        }
        return null;
      }
    });

    if (reason) {
      this.applicationService.updateApplicationStatus(
        application._id,
        {
          status: 'Rejected',
          reviewNotes: reason,
          reviewedBy: this.currentUserId
        }
      ).subscribe({
        next: () => {
          Swal.fire('Success', `Application from ${application.applicantName} has been rejected`, 'success');
          this.loadApplications();
        },
        error: (error: any) => {
          console.error('Error rejecting application:', error);
          Swal.fire('Error', 'Failed to reject application', 'error');
        }
      });
    }
  }

  async moveToReview(application: ReviewApplication): Promise<void> {
    if (application.status === 'Under Review') {
      await Swal.fire('Info', 'This application is already under review', 'info');
      return;
    }

    const { value: notes } = await Swal.fire({
      title: 'Move to Under Review?',
      input: 'textarea',
      inputLabel: 'Review Notes (optional)',
      inputPlaceholder: 'Add any review notes or comments...',
      showCancelButton: true,
      confirmButtonText: 'Move to Review',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0066cc'
    });

    if (notes !== undefined) {
      this.applicationService.updateApplicationStatus(
        application._id,
        {
          status: 'Under Review',
          reviewNotes: notes || '',
          reviewedBy: this.currentUserId
        }
      ).subscribe({
        next: () => {
          Swal.fire('Success', 'Application moved to Under Review', 'success');
          this.loadApplications();
        },
        error: (error: any) => {
          console.error('Error moving application to review:', error);
          Swal.fire('Error', 'Failed to move application to review', 'error');
        }
      });
    }
  }
}
