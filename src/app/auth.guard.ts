import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'];

    if (!requiredRole) {
      return of(true);
    }

    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (!user) {
          Swal.fire('Access Denied', 'Please login first', 'warning').then(() => {
            this.router.navigate(['/login']);
          });
          return false;
        }

        if (!requiredRoles.includes(user.role)) {
          const roleText = requiredRoles.join(' or ');
          Swal.fire('Access Denied', `You must be a ${roleText} to access this page`, 'error').then(() => {
            this.router.navigate(['/']);
          });
          return false;
        }

        return true;
      }),
      catchError(() => {
        Swal.fire('Access Denied', 'Your session is invalid or expired. Please log in again.', 'error').then(() => {
          this.router.navigate(['/login']);
        });
        return of(false);
      })
    );
  }
}
