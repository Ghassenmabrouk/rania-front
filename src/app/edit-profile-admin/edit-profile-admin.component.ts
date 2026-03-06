import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-profile-admin',
  templateUrl: './edit-profile-admin.component.html',
  styleUrls: ['./edit-profile-admin.component.css']
})
export class EditProfileAdminComponent implements OnInit {
  username: string = '';
  email: string = '';
  phone: string = '';
  department: string = '';
  role: string = '';
  joinDate: string = '';

  profilePicture: File | null = null;
  profilePicturePreview: string = '';

  isEditMode: boolean = false;

  departments = [
    'Administration',
    'Human Resources',
    'Engineering',
    'Business',
    'Finance',
    'Operations'
  ];

  roles = [
    'Manager',
    'Admin',
    'Director'
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.username = localStorage.getItem('admin_username') || '';
    this.email = localStorage.getItem('admin_email') || '';
    this.phone = localStorage.getItem('admin_phone') || '';
    this.department = localStorage.getItem('admin_department') || '';
    this.role = localStorage.getItem('admin_role') || '';
    this.joinDate = localStorage.getItem('admin_joinDate') || '';
    this.profilePicturePreview = localStorage.getItem('admin_profilePicturePreview') || '';
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.ngOnInit();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = file;
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async save() {
    if (!this.username || !this.email) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    if (!this.department) {
      Swal.fire('Error', 'Please select a department', 'error');
      return;
    }

    localStorage.setItem('admin_username', this.username);
    localStorage.setItem('admin_email', this.email);
    localStorage.setItem('admin_phone', this.phone);
    localStorage.setItem('admin_department', this.department);
    localStorage.setItem('admin_joinDate', this.joinDate);

    if (this.profilePicturePreview) {
      localStorage.setItem('admin_profilePicturePreview', this.profilePicturePreview);
    }

    this.isEditMode = false;

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been successfully updated.',
      confirmButtonText: 'OK'
    });
  }

  cancel() {
    this.isEditMode = false;
    this.ngOnInit();
  }

  goBackToDashboard() {
    const role = this.authService.getRole();
    if (role === 'admin') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'manager') {
      this.router.navigate(['/dashboard/manager']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
