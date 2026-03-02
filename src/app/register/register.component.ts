import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  loading: boolean = false;
  

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    
    this.loading = true;

    const registerData = {
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.http.post('http://localhost:3000/api/auth/register', registerData).subscribe({
      next: (response: any) => {
         console.log('Registration successful! Redirecting to login...' );
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.loading = false;
        console.log('Registration failed');
      }
    });
  }
}
