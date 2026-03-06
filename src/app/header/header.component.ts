import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, AppUser } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string = '';
  userRole: string = '';
  isLoggedIn: boolean = false;
  showUserMenu: boolean = false;

  private userSub?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe((user: AppUser | null) => {
      this.username = user?.username || '';
      this.userRole = user?.role || '';
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  goToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
    this.showUserMenu = false;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
    this.showUserMenu = false;
  }

  goHome(): void {
    this.router.navigate(['/']);
    this.showUserMenu = false;
  }

  logout(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout('/');
        Swal.fire('Logged out', 'You have been successfully logged out.', 'success');
      }
    });
  }
}
