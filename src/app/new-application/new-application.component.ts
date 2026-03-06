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
  fullName: string = '';
  cinNumber: string = '';
  dateOfBirth: string = '';
  placeOfBirth: string = '';
  nationality: string = '';
  address: string = '';
  phone: string = '';
  email: string = '';

  baccalaureateYear: string = '';
  baccalaureateSection: string = '';
  baccalaureateAverage: string = '';

  bachelorSpecialty: string = '';
  universityName: string = '';
  graduationYear: string = '';
  finalAverage: string = '';

  masterSpecialty: string = '';
  masterType: string = '';

  signatureConfirmed: boolean = false;

  masterPrograms: string[] = [];
  loadingPrograms = false;
  allPrograms: any[] = [];

  constructor(
    private router: Router,
    private programService: ProgramService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadProfileData();
    this.loadMasterPrograms();
  }

  loadMasterPrograms(): void {
    this.loadingPrograms = true;
    this.programService.getAllPrograms().subscribe({
      next: (response: any) => {
        const programs = response.data || [];
        this.allPrograms = programs;
        this.masterPrograms = programs.map((p: any) => p.name).sort();
        this.loadingPrograms = false;
      },
      error: (error: any) => {
        console.error('Error loading programs:', error);
        this.loadingPrograms = false;
        Swal.fire('Error', 'Failed to load master programs', 'error');
      }
    });
  }

  loadProfileData(): void {
    this.fullName = localStorage.getItem('username') || '';
    this.email = localStorage.getItem('email') || '';
    this.phone = localStorage.getItem('phone') || '';
    this.address = localStorage.getItem('address') || '';
    this.dateOfBirth = localStorage.getItem('dateOfBirth') || '';
    this.nationality = localStorage.getItem('nationality') || '';
  }

  submitApplication(): void {
    if (!this.validateForm()) {
      return;
    }

    if (!this.masterSpecialty) {
      Swal.fire('Error', 'Please select a master program', 'error');
      return;
    }

    if (!this.signatureConfirmed) {
      Swal.fire('Error', 'Please confirm that all information is correct', 'error');
      return;
    }

    // Find the program object
    const selectedProgram = this.allPrograms.find(
      (p: any) => p.name === this.masterSpecialty
    );

    if (!selectedProgram) {
      Swal.fire('Error', 'Selected program not found', 'error');
      return;
    }

    // Get user ID from localStorage
    const applicantId = localStorage.getItem('userId');
    if (!applicantId) {
      Swal.fire('Error', 'User not logged in', 'error');
      return;
    }

    // Prepare application data
    const applicationData = {
      applicantId: applicantId,
      applicantName: this.fullName,
      applicantEmail: this.email,
      programId: selectedProgram._id,
      programName: selectedProgram.name,
      status: 'Pending',
      submissionDate: new Date(),
      description: `Application for ${this.masterType} Master in ${this.masterSpecialty}`
    };

    // Show loading
    Swal.fire({
      title: 'Submitting...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Call the API to save the application
    this.applicationService.createApplication(applicationData).subscribe({
      next: (response: any) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Your application has been successfully submitted to the database.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/applicant']);
        });
      },
      error: (error: any) => {
        Swal.close();
        console.error('Error submitting application:', error);
        const errorMessage = error?.error?.message || 'Failed to submit application. Please try again.';
        Swal.fire('Submission Failed', errorMessage, 'error');
      }
    });
  }

  validateForm(): boolean {
    if (!this.fullName || !this.cinNumber || !this.email) {
      Swal.fire('Error', 'Please fill in all required personal information fields', 'error');
      return false;
    }

    if (!this.baccalaureateYear || !this.bachelorSpecialty) {
      Swal.fire('Error', 'Please fill in all required academic background fields', 'error');
      return false;
    }

    if (!this.masterSpecialty || !this.masterType) {
      Swal.fire('Error', 'Please select your master program choice', 'error');
      return false;
    }

    return true;
  }

  cancel(): void {
    Swal.fire({
      title: 'Cancel Application?',
      text: 'All entered data will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, continue'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/dashboard/applicant']);
      }
    });
  }

  goBackToDashboard(): void {
    this.cancel();
  }
}
