import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProgramService } from '../services/program.service';

interface Program {
  _id: string;
  name: string;
  capacity: number;
  enrolled: number;
  department: string;
  description?: string;
  duration?: string;
  requirements?: string;
  active: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-manage-programs',
  templateUrl: './manage-programs.component.html',
  styleUrls: ['./manage-programs.component.css']
})
export class ManageProgramsComponent implements OnInit {
  programs: Program[] = [];
  filteredPrograms: Program[] = [];
  loading = false;
  searchTerm = '';
  sortBy = 'name';

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.loading = true;
    this.programService.getAllPrograms().subscribe({
      next: (response: any) => {
        this.programs = response.data || [];
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading programs:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load programs', 'error');
      }
    });
  }

  applyFiltersAndSort(): void {
    let filtered = this.programs.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    switch (this.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'capacity':
        filtered.sort((a, b) => b.capacity - a.capacity);
        break;
      case 'enrolled':
        filtered.sort((a, b) => b.enrolled - a.enrolled);
        break;
      case 'department':
        filtered.sort((a, b) => a.department.localeCompare(b.department));
        break;
    }

    this.filteredPrograms = filtered;
  }

  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  getEnrollmentPercentage(program: Program): number {
    return (program.enrolled / program.capacity) * 100;
  }

  getEnrollmentStatus(program: Program): string {
    const percentage = this.getEnrollmentPercentage(program);
    if (percentage >= 100) return 'Full';
    if (percentage >= 80) return 'Nearly Full';
    if (percentage >= 50) return 'Half Full';
    return 'Available';
  }

  async addProgram(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Program',
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Program name">' +
        '<input id="swal-capacity" type="number" class="swal2-input" placeholder="Capacity">' +
        '<input id="swal-dept" class="swal2-input" placeholder="Department">' +
        '<textarea id="swal-desc" class="swal2-textarea" placeholder="Description"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const cap = parseInt((document.getElementById('swal-capacity') as HTMLInputElement).value, 10);
        const dept = (document.getElementById('swal-dept') as HTMLInputElement).value;
        const desc = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        if (!name || isNaN(cap) || cap < 1) {
          Swal.showValidationMessage('Name and valid capacity required');
          return null;
        }
        if (!dept) {
          Swal.showValidationMessage('Department is required');
          return null;
        }
        return { name, capacity: cap, department: dept, description: desc };
      }
    });

    if (formValues) {
      this.programService.createProgram({
        name: formValues.name,
        capacity: formValues.capacity,
        department: formValues.department,
        description: formValues.description || '',
        duration: '2 years',
        requirements: '',
        active: true
      }).subscribe({
        next: () => {
          Swal.fire('Success', `Program "${formValues.name}" created successfully`, 'success');
          this.loadPrograms();
        },
        error: (error: any) => {
          console.error('Error creating program:', error);
          Swal.fire('Error', error.error?.error || 'Failed to create program', 'error');
        }
      });
    }
  }

  async editProgram(program: Program): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Program',
      html:
        `<input id="swal-name" class="swal2-input" value="${program.name}" placeholder="Program name">` +
        `<input id="swal-capacity" type="number" class="swal2-input" value="${program.capacity}" placeholder="Capacity">` +
        `<input id="swal-enrolled" type="number" class="swal2-input" value="${program.enrolled}" placeholder="Currently Enrolled" disabled>` +
        `<input id="swal-dept" class="swal2-input" value="${program.department}" placeholder="Department">` +
        `<textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${program.description || ''}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const cap = parseInt((document.getElementById('swal-capacity') as HTMLInputElement).value, 10);
        const dept = (document.getElementById('swal-dept') as HTMLInputElement).value;
        const desc = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        if (!name || isNaN(cap) || cap < 1) {
          Swal.showValidationMessage('Invalid values');
          return null;
        }
        if (!dept) {
          Swal.showValidationMessage('Department is required');
          return null;
        }
        return { name, capacity: cap, department: dept, description: desc };
      }
    });

    if (formValues) {
      this.programService.updateProgram(program._id, {
        name: formValues.name,
        capacity: formValues.capacity,
        department: formValues.department,
        description: formValues.description
      }).subscribe({
        next: () => {
          Swal.fire('Success', 'Program updated successfully', 'success');
          this.loadPrograms();
        },
        error: (error: any) => {
          console.error('Error updating program:', error);
          Swal.fire('Error', error.error?.error || 'Failed to update program', 'error');
        }
      });
    }
  }

  async toggleProgramStatus(program: Program): Promise<void> {
    const newStatus = !program.active;
    const { isConfirmed } = await Swal.fire({
      title: `${newStatus ? 'Activate' : 'Deactivate'} Program?`,
      text: `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} "${program.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    });

    if (isConfirmed) {
      this.programService.updateProgram(program._id, { active: newStatus }).subscribe({
        next: () => {
          Swal.fire('Success', `Program ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
          this.loadPrograms();
        },
        error: (error: any) => {
          console.error('Error updating program status:', error);
          Swal.fire('Error', 'Failed to update program status', 'error');
        }
      });
    }
  }

  async deleteProgram(program: Program): Promise<void> {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete Program?',
      text: `Are you sure you want to permanently delete "${program.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545'
    });

    if (isConfirmed) {
      this.programService.deleteProgram(program._id).subscribe({
        next: () => {
          Swal.fire('Deleted', `Program "${program.name}" has been deleted`, 'success');
          this.loadPrograms();
        },
        error: (error: any) => {
          console.error('Error deleting program:', error);
          Swal.fire('Error', 'Failed to delete program', 'error');
        }
      });
    }
  }
}
