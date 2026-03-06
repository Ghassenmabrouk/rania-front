import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['./programs-list.component.css']
})
export class ProgramsListComponent implements OnInit {
  programs: Program[] = [];
  filteredPrograms: Program[] = [];
  loading = false;
  searchTerm = '';
  selectedDepartment = 'All';

  departments: string[] = [];

  constructor(
    private programService: ProgramService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.loading = true;
    this.programService.getAllPrograms().subscribe({
      next: (response: any) => {
        this.programs = response.data || [];
        this.filteredPrograms = [...this.programs];
        this.extractDepartments();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading programs:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load programs', 'error');
      }
    });
  }

  extractDepartments(): void {
    const depts = new Set(this.programs.map(p => p.department));
    this.departments = Array.from(depts).sort();
  }

  applyFilters(): void {
    let filtered = this.programs.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        program.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (program.description && program.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesDepartment = this.selectedDepartment === 'All' || program.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });

    this.filteredPrograms = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDepartmentChange(): void {
    this.applyFilters();
  }

  getAvailableSpots(program: Program): number {
    return program.capacity - program.enrolled;
  }

  getEnrollmentPercentage(program: Program): number {
    if (program.capacity === 0) return 0;
    return Math.round((program.enrolled / program.capacity) * 100);
  }

  getStatusColor(program: Program): string {
    const percentage = this.getEnrollmentPercentage(program);
    if (percentage >= 100) return '#dc3545'; // red
    if (percentage >= 80) return '#fd7e14'; // orange
    if (percentage >= 60) return '#ffc107'; // yellow
    return '#28a745'; // green
  }

  applyForProgram(program: Program): void {
    if (!program.active) {
      Swal.fire('Program Unavailable', 'This program is currently inactive.', 'warning');
      return;
    }

    if (this.getAvailableSpots(program) <= 0) {
      Swal.fire('Program Full', 'This program has reached its capacity.', 'warning');
      return;
    }

    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login to apply for programs',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.router.navigate(['/new-application']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/applicant']);
  }
}
