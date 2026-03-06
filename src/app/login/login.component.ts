
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      Swal.fire('Error', 'Please enter your email and password', 'error');
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        Swal.fire('Success', 'Login successful!', 'success').then(() => {
          if (user.role === 'admin') this.router.navigate(['/dashboard/admin']);
          else if (user.role === 'manager') this.router.navigate(['/dashboard/manager']);
          else this.router.navigate(['/dashboard/applicant']);
        });
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Login error:', error);
        const errorMessage = error?.error?.message || 'Invalid email or password';
        Swal.fire('Login Failed', errorMessage, 'error');
      }
    });
  }
}
