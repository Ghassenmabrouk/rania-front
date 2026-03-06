import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { StatisticsService, OverviewStats, Deadlines, ApplicationStats } from '../services/statistics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  overviewStats: OverviewStats | null = null;
  deadlines: Deadlines | null = null;
  applicationStats: ApplicationStats | null = null;
  loading = true;
  isLoggedIn = false;

  heroImages = [
    'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1920'
  ];
  currentImageIndex = 0;
  private sliderInterval: any;

  constructor(private statisticsService: StatisticsService, private router: Router) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.startImageSlider();
    this.checkLoginStatus();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  startImageSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
    }, 5000);
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }

  loadStatistics(): void {
    this.statisticsService.getOverviewStats().subscribe(stats => {
      this.overviewStats = stats;
    });

    this.statisticsService.getDeadlines().subscribe(deadlines => {
      this.deadlines = deadlines;
    });

    this.statisticsService.getApplicationStats().subscribe(stats => {
      this.applicationStats = stats;
      this.loading = false;
    });
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('username');
  }

  goToDashboard(): void {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'manager') {
      this.router.navigate(['/dashboard/manager']);
    } else {
      this.router.navigate(['/dashboard/applicant']);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
