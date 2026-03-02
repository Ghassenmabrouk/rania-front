import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProgramService } from '../services/program.service';

interface Program {
  _id: string;
  name: string;
  capacity: number;
  enrolled: number;
  department?: string;
}

@Component({
  selector: 'app-manage-programs',
  templateUrl: './manage-programs.component.html',
  styleUrls: ['./manage-programs.component.css']
})
export class ManageProgramsComponent implements OnInit {
  programs: Program[] = [];
  loading = false;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.loading = true;
    this.programService.getAllPrograms().subscribe({
      next: (res) => {
        this.programs = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading programs', err);
        this.loading = false;
      }
    });
  }

  async addProgram(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Program',
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Program name">' +
        '<input id="swal-capacity" type="number" class="swal2-input" placeholder="Capacity">' +
        '<input id="swal-dept" class="swal2-input" placeholder="Department (optional)">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const cap = parseInt((document.getElementById('swal-capacity') as HTMLInputElement).value, 10);
        const dept = (document.getElementById('swal-dept') as HTMLInputElement).value;
        if (!name || isNaN(cap) || cap < 1) {
          Swal.showValidationMessage('Name and valid capacity required');
          return null;
        }
        return { name, capacity: cap, department: dept };
      }
    });

    if (formValues) {
      Swal.fire({ title: 'Creating program…', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      this.programService.createProgram(formValues).subscribe({
        next: () => {
          Swal.fire('Success', 'Program created', 'success');
          this.loadPrograms();
        },
        error: (err) => {
          Swal.fire('Error', err.error?.error || 'Failed to create program', 'error');
        }
      });
    }
  }
}
