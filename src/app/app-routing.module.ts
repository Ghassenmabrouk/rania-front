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
import { ProgramsListComponent } from './programs-list/programs-list.component';
import { ManageApplicantsComponent } from './manage-applicants/manage-applicants.component';
import { ManageProgramsComponent } from './manage-programs/manage-programs.component';
import { ReviewApplicationsComponent } from './review-applications/review-applications.component';
import { EditProfileAdminComponent } from './edit-profile-admin/edit-profile-admin.component';
import { RoleGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/applicant', component: ApplicantDashboardComponent, canActivate: [RoleGuard], data: { role: 'applicant' } },
  { path: 'dashboard/admin', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
  { path: 'dashboard/manager', component: ManagerDashboardComponent, canActivate: [RoleGuard], data: { role: 'manager' } },

  // additional feature routes
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [RoleGuard] },
  { path: 'edit-profile-admin', component: EditProfileAdminComponent, canActivate: [RoleGuard], data: { role: ['admin', 'manager'] } },
  { path: 'new-application', component: NewApplicationComponent, canActivate: [RoleGuard], data: { role: 'applicant' } },
  { path: 'upload-documents', component: UploadDocumentsComponent, canActivate: [RoleGuard], data: { role: 'applicant' } },
  { path: 'programs-list', component: ProgramsListComponent, canActivate: [RoleGuard] },

  // manager/administrator management routes
  { path: 'manage-applicants', component: ManageApplicantsComponent, canActivate: [RoleGuard], data: { role: 'manager' } },
  { path: 'manage-programs', component: ManageProgramsComponent, canActivate: [RoleGuard], data: { role: 'manager' } },
  { path: 'review-applications', component: ReviewApplicationsComponent, canActivate: [RoleGuard], data: { role: 'manager' } },

  // fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
