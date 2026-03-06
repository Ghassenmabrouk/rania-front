import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, AppUser } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';
  address: string = '';
  dateOfBirth: string = '';
  nationality: string = '';
  studentId: string = '';

  profilePicture: File | null = null;
  profilePicturePreview: string = '';
  bachelorCopy: File | null = null;
  bachelorCopyPreview: string = '';
  cinCard: File | null = null;
  cinCardPreview: string = '';

  currentYear: number = new Date().getFullYear();
  showStudentCard: boolean = false;
  isEditMode: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.populateFromUser(user);
      } else {
        this.populateFromLocalStorage();
      }
    });
  }

  private populateFromUser(user: AppUser): void {
    this.username = user.username || '';
    this.email = user.email || '';
    this.phone = user.phone || '';
    this.address = user.address || '';
    this.dateOfBirth = user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '';
    this.nationality = user.nationality || '';
    this.studentId = user.studentId || this.generateStudentId();
    this.profilePicturePreview = user.profilePicture || '';
    this.bachelorCopyPreview = user.bachelorCopy || '';
    this.cinCardPreview = user.cinCard || '';
  }

  private populateFromLocalStorage(): void {
    this.username = localStorage.getItem('username') || '';
    this.email = localStorage.getItem('email') || '';
    this.phone = localStorage.getItem('phone') || '';
    this.address = localStorage.getItem('address') || '';
    this.dateOfBirth = localStorage.getItem('dateOfBirth') || '';
    this.nationality = localStorage.getItem('nationality') || '';
    this.studentId = localStorage.getItem('studentId') || this.generateStudentId();
    this.profilePicturePreview = localStorage.getItem('profilePicturePreview') || '';
    this.bachelorCopyPreview = localStorage.getItem('bachelorCopyPreview') || '';
    this.cinCardPreview = localStorage.getItem('cinCardPreview') || '';
  }

  generateStudentId(): string {
    return 'ISAEG' + Math.floor(100000 + Math.random() * 900000);
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.ngOnInit();
    }
  }

  onFileSelected(event: any, type: 'profile' | 'bachelor' | 'cin'): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        switch(type) {
          case 'profile':
            this.profilePicture = file;
            this.profilePicturePreview = e.target.result;
            break;
          case 'bachelor':
            this.bachelorCopy = file;
            this.bachelorCopyPreview = e.target.result;
            break;
          case 'cin':
            this.cinCard = file;
            this.cinCardPreview = e.target.result;
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  toggleStudentCard() {
    if (!this.username || !this.profilePicturePreview) {
      Swal.fire('Info', 'Please add your name and profile picture first to generate your student card', 'info');
      return;
    }
    this.showStudentCard = !this.showStudentCard;
  }

  save() {
    if (!this.username || !this.email) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('phone', this.phone || '');
    formData.append('address', this.address || '');
    formData.append('dateOfBirth', this.dateOfBirth || '');
    formData.append('nationality', this.nationality || '');
    formData.append('studentId', this.studentId || '');

    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }
    if (this.bachelorCopy) {
      formData.append('bachelorCopy', this.bachelorCopy);
    }
    if (this.cinCard) {
      formData.append('cinCard', this.cinCard);
    }

    this.userService.updateProfile(formData).subscribe({
      next: () => {
        this.isEditMode = false;
        this.authService.getCurrentUser().subscribe(user => {
          if (user) {
            this.populateFromUser(user);
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been successfully updated.',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        console.error('Profile update error:', error);
        Swal.fire('Error', 'Failed to update profile. Please try again.', 'error');
      }
    });
  }

  cancel() {
    this.isEditMode = false;
    this.loadUserData();
  }

  goBackToDashboard() {
    this.router.navigate(['/dashboard/applicant']);
  }
}
