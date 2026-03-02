import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProgramService } from '../services/program.service';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css']
})
export class NewApplicationComponent implements OnInit {
  programs: any[] = [];
  formData: any = {
    programId: '',
    description: ''
  };

  constructor(
    private programService: ProgramService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService.getAllPrograms().subscribe(
      (res: any) => {
        this.programs = res;
      },
      err => {
        console.error('Failed to load programs', err);
        Swal.fire('Error', 'Unable to fetch programs at the moment.', 'error');
      }
    );
  }

  submitApplication(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire('Error', 'You must be logged in to submit an application.', 'error');
      return;
    }

    const payload = {
      ...this.formData,
      applicantId: userId,
      status: 'Pending'
    };

    this.applicationService.createApplication(payload).subscribe(
      (created: any) => {
        Swal.fire('Success', 'Application submitted successfully!', 'success').then(() => {
          this.router.navigate(['/applicant-dashboard']);
        });
      },
      err => {
        console.error('Create application failed', err);
        Swal.fire('Error', 'Failed to submit application.', 'error');
      }
    );
  }
}
