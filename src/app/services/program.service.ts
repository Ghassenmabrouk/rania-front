import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private apiUrl = 'http://localhost:3000/api/programs';

  constructor(private http: HttpClient) {}

  getAllPrograms(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProgramById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProgram(programData: any): Observable<any> {
    return this.http.post(this.apiUrl, programData);
  }

  updateProgram(id: string, programData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, programData);
  }

  deleteProgram(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
