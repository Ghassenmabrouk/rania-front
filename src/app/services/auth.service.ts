import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AppUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  nationality?: string;
  studentId?: string;
  profilePicture?: string;
  bachelorCopy?: string;
  cinCard?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBase = 'http://localhost:3000/api';
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as AppUser;
        this.userSubject.next(user);
      } catch {
        this.clearStorage();
      }
    }
  }

  private saveToStorage(user: AppUser, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);
    localStorage.setItem('userId', user._id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('email', user.email);
    if (user.phone) localStorage.setItem('phone', user.phone);
    if (user.address) localStorage.setItem('address', user.address);
    if (user.dateOfBirth) localStorage.setItem('dateOfBirth', user.dateOfBirth);
    if (user.nationality) localStorage.setItem('nationality', user.nationality);
    if (user.profilePicture) localStorage.setItem('profilePicture', user.profilePicture);
    if (user.bachelorCopy) localStorage.setItem('bachelorCopy', user.bachelorCopy);
    if (user.cinCard) localStorage.setItem('cinCard', user.cinCard);

    this.userSubject.next(user);
  }

  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('address');
    localStorage.removeItem('dateOfBirth');
    localStorage.removeItem('nationality');
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('bachelorCopy');
    localStorage.removeItem('cinCard');
    this.userSubject.next(null);
  }

  login(email: string, password: string): Observable<AppUser> {
    return this.http.post<any>(`${this.apiBase}/auth/login`, { email, password }).pipe(
      tap(response => {
        if (response?.token && response?.user) {
          this.saveToStorage(response.user, response.token);
        }
      }),
      map(response => response.user)
    );
  }

  register(registerData: any): Observable<AppUser> {
    return this.http.post<any>(`${this.apiBase}/auth/register`, registerData).pipe(
      tap(response => {
        if (response?.token && response?.user) {
          this.saveToStorage(response.user, response.token);
        }
      }),
      map(response => response.user)
    );
  }

  logout(redirectUrl: string = '/login'): void {
    this.clearStorage();
    this.router.navigate([redirectUrl]);
  }

  getCurrentUser(): Observable<AppUser | null> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.clearStorage();
      return of(null);
    }

    return this.http.get<any>(`${this.apiBase}/auth/me`).pipe(
      tap(response => {
        if (response?.data) {
          this.saveToStorage(response.data, token);
        }
      }),
      map(response => response.data as AppUser),
      catchError(() => {
        this.clearStorage();
        return of(null);
      })
    );
  }

  getRole(): string | null {
    return this.userSubject.value?.role || null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isManager(): boolean {
    return this.getRole() === 'manager';
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
