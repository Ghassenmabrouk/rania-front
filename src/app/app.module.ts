import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ApplicantDashboardComponent,
    AdminDashboardComponent,
    ManagerDashboardComponent,
    EditProfileComponent,
    NewApplicationComponent,
    UploadDocumentsComponent,
    ProgramsComponent,
    ManageApplicantsComponent,
    ManageProgramsComponent,
    ReviewApplicationsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
