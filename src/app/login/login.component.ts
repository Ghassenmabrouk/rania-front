
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.email || !this.password) return;

    this.http.post('http://localhost:3000/api/auth/login', { email: this.email, password: this.password })
      .subscribe((res: any) => {
        const user = res.user || res;
        const role = user?.role || 'user';
        const username = user?.username || user?.name || '';
        const userId = user?._id || '';
        const email = user?.email || '';

        if (username) localStorage.setItem('username', username);
        if (userId) localStorage.setItem('userId', userId);
        if (email) localStorage.setItem('email', email);

        if (role === 'admin') this.router.navigate(['/dashboard/admin']);
        else if (role === 'manager') this.router.navigate(['/dashboard/manager']);
        else this.router.navigate(['/dashboard/applicant']);
      });
  }
}
