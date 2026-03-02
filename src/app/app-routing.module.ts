import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ApplicantDashboardComponent } from './applicant-dashboard/applicant-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NewApplicationComponent } from './new-application/new-application.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { ProgramsComponent } from './programs/programs.component';
import { ManageApplicantsComponent } from './manage-applicants/manage-applicants.component';
import { ManageProgramsComponent } from './manage-programs/manage-programs.component';
import { ReviewApplicationsComponent } from './review-applications/review-applications.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/applicant', component: ApplicantDashboardComponent },
  { path: 'dashboard/admin', component: AdminDashboardComponent },
  { path: 'dashboard/manager', component: ManagerDashboardComponent },

  // additional feature routes
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'new-application', component: NewApplicationComponent },
  { path: 'upload-documents', component: UploadDocumentsComponent },
  { path: 'programs', component: ProgramsComponent },

  // manager management routes
  { path: 'manage-applicants', component: ManageApplicantsComponent },
  { path: 'manage-programs', component: ManageProgramsComponent },
  { path: 'review-applications', component: ReviewApplicationsComponent },

  // fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
