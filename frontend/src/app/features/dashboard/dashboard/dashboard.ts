import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  stats?: DashboardStats;

  constructor(
    private readonly dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
     next: response => {
  console.log('Dashboard Stats:', response);
  this.stats = response;
},
      error: error => {
        console.error(error);
      }
    });
  }
}