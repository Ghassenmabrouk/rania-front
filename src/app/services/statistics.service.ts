import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface OverviewStats {
  totalUsers: number;
  totalApplicants: number;
  totalManagers: number;
  totalAdmins: number;
  applicationStartDate: string;
  latestApplicationDate: string;
}

export interface Deadlines {
  academicYear: string;
  masterApplicationStartDate: string;
  masterApplicationDeadline: string;
  semesterStartDate: string;
  importantDates: ImportantDate[];
}

export interface ImportantDate {
  title: string;
  date: string;
  description: string;
}

export interface ApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  availablePrograms: number;
  acceptanceRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:3000/api/stats';
  private cache: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  getOverviewStats(): Observable<OverviewStats> {
    if (this.cache['overview']) {
      return of(this.cache['overview']);
    }

    return this.http.get<any>(`${this.apiUrl}/overview`).pipe(
      map(response => {
        this.cache['overview'] = response.data;
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching overview stats:', error);
        return of({
          totalUsers: 0,
          totalApplicants: 0,
          totalManagers: 0,
          totalAdmins: 0,
          applicationStartDate: new Date().toISOString(),
          latestApplicationDate: new Date().toISOString()
        });
      })
    );
  }

  getDeadlines(): Observable<Deadlines> {
    if (this.cache['deadlines']) {
      return of(this.cache['deadlines']);
    }

    return this.http.get<any>(`${this.apiUrl}/deadlines`).pipe(
      map(response => {
        this.cache['deadlines'] = response.data;
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching deadlines:', error);
        return of({
          academicYear: '2025-2026',
          masterApplicationStartDate: '2025-01-01',
          masterApplicationDeadline: '2025-06-30',
          semesterStartDate: '2025-09-15',
          importantDates: []
        });
      })
    );
  }

  getApplicationStats(): Observable<ApplicationStats> {
    if (this.cache['applications']) {
      return of(this.cache['applications']);
    }

    return this.http.get<any>(`${this.apiUrl}/applications`).pipe(
      map(response => {
        this.cache['applications'] = response.data;
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching application stats:', error);
        return of({
          totalApplications: 0,
          pendingApplications: 0,
          acceptedApplications: 0,
          rejectedApplications: 0,
          availablePrograms: 0,
          acceptanceRate: 0
        });
      })
    );
  }

  clearCache(): void {
    this.cache = {};
  }
}
