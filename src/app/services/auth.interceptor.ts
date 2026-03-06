import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const cloned = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(cloned).pipe(
      catchError((err) => {
        const authService = this.injector.get(AuthService);
        const isBanError = err?.status === 403 && typeof err?.error?.message === 'string' && err.error.message.toLowerCase().includes('banned');

        if (isBanError) {
          authService.logout('/login');
        }

        return throwError(() => err);
      })
    );
  }
}
