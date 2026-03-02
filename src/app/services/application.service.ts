import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api/applications';

  constructor(private http: HttpClient) {}

  getAllApplications(status?: string, applicantId?: string): Observable<any> {
    let url = this.apiUrl;
    const params: string[] = [];

    if (status) params.push(`status=${status}`);
    if (applicantId) params.push(`applicantId=${applicantId}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get(url);
  }

  getApplicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createApplication(applicationData: any): Observable<any> {
    return this.http.post(this.apiUrl, applicationData);
  }

  updateApplication(id: string, applicationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, applicationData);
  }

  updateApplicationStatus(id: string, statusData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, statusData);
  }

  deleteApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getApplicantApplications(applicantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/applicant/${applicantId}`);
  }
}
