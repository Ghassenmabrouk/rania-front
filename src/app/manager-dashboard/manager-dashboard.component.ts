import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProgramService } from '../services/program.service';
import { ApplicationService } from '../services/application.service';
import { UserService } from '../services/user.service';

interface Application {
  _id: string;
  applicantName: string;
  programName: string;
  submissionDate: string;
  status: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
}

interface MasterProgram {
  _id: string;
  name: string;
  capacity: number;
  enrolled: number;
}

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
  username: string | null = localStorage.getItem('username');
  managerName: string = this.username || 'Manager';
  managerEmail: string = localStorage.getItem('email') || 'manager@example.com';
  managerDepartment: string = 'Engineering';

  totalApplicants: number = 0;
  pendingReviews: number = 0;
  activePrograms: number = 0;
  approvedThisMonth: number = 0;

  masterPrograms: MasterProgram[] = [];
  recentApplications: Application[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private programService: ProgramService,
    private applicationService: ApplicationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadManagerData();
  }

  loadManagerData(): void {
    this.programService.getAllPrograms().subscribe({
      next: (response) => {
        this.masterPrograms = response.data || [];
        this.activePrograms = this.masterPrograms.length;
      },
      error: (error) => console.error('Error loading programs:', error)
    });

    this.applicationService.getAllApplications().subscribe({
      next: (response) => {
        const applications = response.data || [];
        this.recentApplications = applications.slice(0, 5);
        this.totalApplicants = applications.length;
        this.pendingReviews = applications.filter((app: any) => app.status === 'Pending').length;

        const currentMonth = new Date().getMonth();
        this.approvedThisMonth = applications.filter((app: any) => {
          const appDate = new Date(app.submissionDate);
          return app.status === 'Accepted' && appDate.getMonth() === currentMonth;
        }).length;
      },
      error: (error) => console.error('Error loading applications:', error)
    });
  }

  async manageStudents(): Promise<void> {
    const result = await Swal.fire({
      title: 'Manage Applicants',
      text: 'Go to the applicants management page?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
    if (result.isConfirmed) {
      this.router.navigate(['/manage-applicants']);
    }
  }

  async manageManagers(): Promise<void> {
    const result = await Swal.fire({
      title: 'Manager Management',
      html: `
        <div style="text-align: left;">
          <p><strong>Manager Operations:</strong></p>
          <ul style="list-style: none; padding: 0;">
            <li>👤 View all managers</li>
            <li>➕ Add new managers</li>
            <li>✏️ Edit manager details</li>
            <li>🗑️ Remove managers</li>
          </ul>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Add New Manager',
      cancelButtonText: 'Close',
      confirmButtonColor: '#123777',
      cancelButtonColor: '#666'
    });

    if (result.isConfirmed) {
      this.addNewManager();
    }
  }

  async addNewManager(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Manager',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Username">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Email" type="email">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Password" type="password">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#123777',
      preConfirm: () => {
        const username = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const email = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const password = (document.getElementById('swal-input3') as HTMLInputElement).value;

        if (!username || !email || !password) {
          Swal.showValidationMessage('Please fill all fields');
          return null;
        }

        return { username, email, password };
      }
    });

    if (formValues) {
      Swal.fire({
        title: 'Creating Manager...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.http.post('http://localhost:3000/api/auth/register', {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
        confirmPassword: formValues.password,
        role: 'manager'
      }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success!',
            text: 'Manager account created successfully',
            icon: 'success',
            confirmButtonColor: '#123777'
          });
          this.loadManagerData();
        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.error?.message || 'Failed to create manager account',
            icon: 'error',
            confirmButtonColor: '#123777'
          });
        }
      });
    }
  }

  async managePrograms(): Promise<void> {
    const result = await Swal.fire({
      title: 'Manage Programs',
      text: 'Open program management tools?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
    if (result.isConfirmed) {
      this.router.navigate(['/manage-programs']);
    }
  }

  async reviewApplications(): Promise<void> {
    const result = await Swal.fire({
      title: 'Review Applications',
      text: 'Proceed to the applications review page?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
    if (result.isConfirmed) {
      this.router.navigate(['/review-applications']);
    }
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

  viewDetails(applicationId: string): void {
    this.applicationService.getApplicationById(applicationId).subscribe({
      next: (response) => {
        console.log('Application details:', response.data);
      },
      error: (error) => console.error('Error loading application details:', error)
    });
  }

  processApplication(applicationId: string): void {
    console.log('Processing application:', applicationId);
  }

  downloadDocuments(applicationId: string): void {
    console.log('Downloading documents for application:', applicationId);
  }
}
