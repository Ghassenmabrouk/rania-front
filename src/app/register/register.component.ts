import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';
  address: string = '';
  dateOfBirth: string = '';
  nationality: string = '';
  profilePictureFile: File | null = null;
  loading: boolean = false;
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(private authService: AuthService, private router: Router) {}

  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.profilePictureFile = input.files?.[0] || null;
  }

  register() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('confirmPassword', this.confirmPassword);
    formData.append('phone', this.phone);
    formData.append('address', this.address);
    formData.append('dateOfBirth', this.dateOfBirth);
    formData.append('nationality', this.nationality);

    if (this.profilePictureFile) {
      formData.append('profilePicture', this.profilePictureFile);
    }

    this.authService.register(formData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Success', 'Registration successful! Redirecting to dashboard...', 'success').then(() => {
          this.router.navigate(['/dashboard/applicant']);
        });
      },
      error: (error: any) => {
        this.loading = false;
        const errorMessage = error?.error?.message || 'Registration failed';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
