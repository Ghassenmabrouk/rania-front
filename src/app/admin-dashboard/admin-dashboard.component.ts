import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  username: string | null = localStorage.getItem('username');
  totalManagers: number = 0;
  totalApplications: number = 0;
  totalMessages: number = 23;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    this.http.get<any>('http://localhost:3000/api/stats/overview').subscribe({
      next: (response) => {
        this.totalManagers = response.data.totalManagers || 0;
        this.totalApplications = response.data.totalApplicants || 0;
      },
      error: (error) => {
        console.error('Error loading admin data:', error);
      }
    });
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
          this.loadAdminData();
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

  async configureSettings(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'System Settings',
      html:
        '<label style="display:block; text-align:left; margin-bottom:5px;">Application Deadline:</label>' +
        '<input id="swal-deadline" class="swal2-input" type="date" value="2025-06-30">' +
        '<label style="display:block; text-align:left; margin-bottom:5px; margin-top:10px;">Semester Start:</label>' +
        '<input id="swal-semester" class="swal2-input" type="date" value="2025-09-15">' +
        '<label style="display:block; text-align:left; margin-bottom:5px; margin-top:10px;">Max Applications per User:</label>' +
        '<input id="swal-max-apps" class="swal2-input" type="number" value="3">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#123777',
      confirmButtonText: 'Save Settings',
      preConfirm: () => {
        return {
          deadline: (document.getElementById('swal-deadline') as HTMLInputElement).value,
          semester: (document.getElementById('swal-semester') as HTMLInputElement).value,
          maxApps: (document.getElementById('swal-max-apps') as HTMLInputElement).value
        };
      }
    });

    if (formValues) {
      Swal.fire({
        title: 'Saved!',
        text: 'System settings updated successfully',
        icon: 'success',
        confirmButtonColor: '#123777'
      });
    }
  }

  async editContacts(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Contact Information',
      html:
        '<label style="display:block; text-align:left; margin-bottom:5px;">Email:</label>' +
        '<input id="swal-email" class="swal2-input" value="admissions@university.edu">' +
        '<label style="display:block; text-align:left; margin-bottom:5px; margin-top:10px;">Phone:</label>' +
        '<input id="swal-phone" class="swal2-input" value="+1 (555) 123-4567">' +
        '<label style="display:block; text-align:left; margin-bottom:5px; margin-top:10px;">Address:</label>' +
        '<textarea id="swal-address" class="swal2-textarea">123 University Avenue, City, Country</textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#123777',
      confirmButtonText: 'Save Contacts',
      preConfirm: () => {
        return {
          email: (document.getElementById('swal-email') as HTMLInputElement).value,
          phone: (document.getElementById('swal-phone') as HTMLInputElement).value,
          address: (document.getElementById('swal-address') as HTMLTextAreaElement).value
        };
      }
    });

    if (formValues) {
      Swal.fire({
        title: 'Updated!',
        text: 'Contact information saved successfully',
        icon: 'success',
        confirmButtonColor: '#123777'
      });
    }
  }

  async generateReports(): Promise<void> {
    const { value: reportType } = await Swal.fire({
      title: 'Generate Report',
      input: 'select',
      inputOptions: {
        'applications': 'Application Statistics',
        'users': 'User Activity Report',
        'managers': 'Manager Performance',
        'system': 'System Usage Report'
      },
      inputPlaceholder: 'Select report type',
      showCancelButton: true,
      confirmButtonColor: '#123777',
      confirmButtonText: 'Generate',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a report type';
        }
        return null;
      }
    });

    if (reportType) {
      Swal.fire({
        title: 'Generating Report...',
        html: 'Please wait while we compile your data',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        }
      }).then(() => {
        Swal.fire({
          title: 'Report Ready!',
          html: `Your <strong>${reportType}</strong> report has been generated.<br>Download will start automatically.`,
          icon: 'success',
          confirmButtonColor: '#123777'
        });
      });
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
      this.router.navigate(['/edit-profile-admin']);
    }
  }
}
