import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent implements OnInit {
  applicationId: string | null = null;
  selectedFiles: FileList | null = null;
  uploadProgress = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.applicationId = params.get('applicationId');
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (!this.applicationId) {
      Swal.fire('Error', 'No application specified.', 'error');
      return;
    }
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      Swal.fire('Error', 'Please select at least one file.', 'error');
      return;
    }

    const formData = new FormData();
    Array.from(this.selectedFiles).forEach(file => formData.append('documents', file, file.name));

    Swal.fire({
      title: 'Uploading...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post(`http://localhost:3000/api/applications/${this.applicationId}/documents`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          Swal.fire('Success', 'Documents uploaded successfully.', 'success');
        }
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Upload Error', err.error?.error || 'Failed to upload files.', 'error');
      }
    });
  }
}
