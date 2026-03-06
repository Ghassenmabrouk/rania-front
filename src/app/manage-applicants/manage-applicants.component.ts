import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApplicationService } from '../services/application.service';
import { UserService } from '../services/user.service';

interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  programApplied: string;
  applicationDate: string;
  status: string;
  qualifications: string;
  isBanned?: boolean;
}

@Component({
  selector: 'app-manage-applicants',
  templateUrl: './manage-applicants.component.html',
  styleUrls: ['./manage-applicants.component.css']
})
export class ManageApplicantsComponent implements OnInit {
  applicants: Applicant[] = [];
  filteredApplicants: Applicant[] = [];
  loading = false;
  searchTerm = '';
  filterStatus = 'All';
  filterProgram = 'All';
  currentPage = 1;
  itemsPerPage = 10;
  uniquePrograms: string[] = [];

  statusOptions = ['All', 'Pending', 'Under Review', 'Accepted', 'Rejected'];

  get paginatedApplicants(): Applicant[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredApplicants.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredApplicants.length / this.itemsPerPage);
  }

  getDisplayMax(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredApplicants.length);
  }

  constructor(
    private applicationService: ApplicationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadApplicants();
  }

  loadApplicants(): void {
    this.loading = true;
    
    // Get all applicant users
    this.userService.getAllUsers('applicant').subscribe({
      next: (usersData: any) => {
        // Get all applications
        this.applicationService.getAllApplications().subscribe({
          next: (applicationsData: any) => {
            const applications = applicationsData.data || [];
            const users = usersData.data || [];

            // Create a map of applicant-to-applications
            const applicantMap = new Map<string, any[]>();
            applications.forEach((app: any) => {
              const applicantId = app.applicantId && (app.applicantId._id || app.applicantId);
              if (!applicantId) return;
              if (!applicantMap.has(applicantId)) {
                applicantMap.set(applicantId, []);
              }
              applicantMap.get(applicantId)!.push(app);
            });

            // Build applicant list with application status
            this.applicants = users.map((user: any) => {
              const userApps = applicantMap.get(user._id) || [];
              const latestApp = userApps[0]; // Most recent application
              
              return {
                _id: user._id,
                name: user.username,
                email: user.email,
                phone: user.phone || 'N/A',
                programApplied: latestApp?.programName || 'N/A',
                applicationDate: latestApp?.submissionDate 
                  ? new Date(latestApp.submissionDate).toLocaleDateString() 
                  : 'N/A',
                status: latestApp?.status || 'No Application',
                qualifications: user.address || 'Not specified',
                isBanned: !!user.isBanned
              };
            });

            this.extractUniquePrograms();
            this.applyFilters();
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Error loading applications:', error);
            this.loading = false;
            Swal.fire('Error', 'Failed to load applications', 'error');
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading applicants:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load applicants', 'error');
      }
    });
  }

  extractUniquePrograms(): void {
    const programs = new Set(this.applicants
      .map(a => a.programApplied)
      .filter(p => p !== 'N/A'));
    this.uniquePrograms = Array.from(programs).sort();
  }

  applyFilters(): void {
    let filtered = this.applicants.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.phone.includes(this.searchTerm);

      const matchesStatus = this.filterStatus === 'All' || a.status === this.filterStatus;

      const matchesProgram = this.filterProgram === 'All' || a.programApplied === this.filterProgram;

      return matchesSearch && matchesStatus && matchesProgram;
    });

    this.filteredApplicants = filtered;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  viewApplicantDetails(applicant: Applicant): void {
    Swal.fire({
      title: applicant.name,
      html: `
        <div style="text-align: left; padding: 20px;">
          <p><strong>Email:</strong> ${applicant.email}</p>
          <p><strong>Phone:</strong> ${applicant.phone}</p>
          <p><strong>Program Applied:</strong> ${applicant.programApplied}</p>
          <p><strong>Application Date:</strong> ${applicant.applicationDate}</p>
          <p><strong>Status:</strong> <span style="background: ${this.getStatusColor(applicant.status)}; padding: 3px 8px; border-radius: 12px; color: white;">${applicant.status}</span></p>
          <p><strong>Location:</strong></p>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 5px;">${applicant.qualifications}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#123777'
    });
  }

  editApplicant(applicant: Applicant): void {
    Swal.fire({
      title: `Edit ${applicant.name}`,
      html: `
        <div style="text-align: left;">
          <label style="font-weight: 600;">Full Name</label>
          <input id="swal-name" class="swal2-input" value="${applicant.name}" />
          <label style="font-weight: 600;">Email</label>
          <input id="swal-email" class="swal2-input" value="${applicant.email}" />
          <label style="font-weight: 600;">Phone</label>
          <input id="swal-phone" class="swal2-input" value="${applicant.phone}" />
          <label style="font-weight: 600;">Location</label>
          <input id="swal-location" class="swal2-input" value="${applicant.qualifications}" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;
        const location = (document.getElementById('swal-location') as HTMLInputElement).value;

        if (!name || !email) {
          Swal.showValidationMessage('Name and email are required');
          return null;
        }

        return { name, email, phone, location };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.userService.updateUser(applicant._id, {
          username: result.value.name,
          email: result.value.email,
          phone: result.value.phone,
          address: result.value.location
        }).subscribe({
          next: () => {
            Swal.fire('Updated', 'Applicant profile updated successfully.', 'success');
            this.loadApplicants();
          },
          error: (error: any) => {
            console.error('Failed to update applicant:', error);
            Swal.fire('Error', 'Failed to update applicant profile.', 'error');
          }
        });
      }
    });
  }

  toggleBanApplicant(applicant: Applicant): void {
    const action = applicant.isBanned ? 'Unban' : 'Ban';

    Swal.fire({
      title: `${action} ${applicant.name}?`,
      text: applicant.isBanned
        ? 'This applicant will be allowed to login again.'
        : 'This applicant will no longer be able to log in.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: action,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.updateUser(applicant._id, {
          isBanned: !applicant.isBanned
        }).subscribe({
          next: () => {
            Swal.fire('Success', `${action}ned successfully.`, 'success');
            this.loadApplicants();
          },
          error: (error: any) => {
            console.error(`Failed to ${action.toLowerCase()} applicant:`, error);
            Swal.fire('Error', `Failed to ${action.toLowerCase()} the applicant.`, 'error');
          }
        });
      }
    });
  }

  deleteApplicant(applicant: Applicant): void {
    Swal.fire({
      title: `Delete ${applicant.name}?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteUser(applicant._id).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Applicant account deleted successfully.', 'success');
            this.loadApplicants();
          },
          error: (error: any) => {
            console.error('Failed to delete applicant:', error);
            Swal.fire('Error', 'Failed to delete applicant.', 'error');
          }
        });
      }
    });
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

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  async exportToCSV(): Promise<void> {
    const headers = ['Name', 'Email', 'Phone', 'Program Applied', 'Application Date', 'Status', 'Qualifications'];
    const rows = this.filteredApplicants.map(a => [
      a.name,
      a.email,
      a.phone,
      a.programApplied,
      a.applicationDate,
      a.status,
      a.qualifications
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `applicants_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    await Swal.fire('Success', `Exported ${this.filteredApplicants.length} applicants to CSV`, 'success');
  }
}
