import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ReportService } from '../../../core/services/report.service';
import { VisitService } from '../../../core/services/visit.service';
import { DashboardStats } from '../../../core/models/dashboard-stats.model';
import { Visit } from '../../../core/models/visit.model';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(
  ...registerables,
  ChartDataLabels
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  stats?: DashboardStats;
  recentVisits: Visit[] = [];
  isLoading = true;

  departmentReport: any[] = [];
  approvalSummary: any;

  private departmentChart?: Chart;
  private approvalChart?: Chart;
  private themeObserver?: MutationObserver;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly reportService: ReportService,
    private readonly visitService: VisitService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    
    // Refresh charts if theme changes
  this.themeObserver = new MutationObserver(() => {

  if (this.stats) {

    this.createDepartmentChart();
    this.createApprovalChart();

  }

});

this.themeObserver.observe(
  document.body,
  {
    attributes: true,
    attributeFilter: ['class']
  }
);
  }

  ngOnDestroy(): void {

  this.departmentChart?.destroy();

  this.approvalChart?.destroy();

  this.themeObserver?.disconnect();

}

  loadData(): void {
    this.isLoading = true;

    // Load dashboard stats
    this.dashboardService.getStats().subscribe({
      next: response => {
        this.stats = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error(error);
        this.isLoading = false;
      }
    });

    // Load recent visits
    this.visitService.getAll().subscribe({
      next: visits => {
        this.recentVisits = visits
          .sort((a, b) => b.visitId - a.visitId)
          .slice(0, 5);
        this.cdr.detectChanges();
      },
      error: error => {
        console.error(error);
      }
    });

    // Load department report for chart
    this.reportService.getDepartmentReport().subscribe({
      next: (report: any) => {
        this.departmentReport = report;
        setTimeout(() => {
          this.createDepartmentChart();
        }, 100);
        this.cdr.detectChanges();
      },
      error: error => console.error(error)
    });

    // Load approval summary for chart
    this.reportService.getApprovalSummary().subscribe({
      next: (summary: any) => {
        this.approvalSummary = summary;
        setTimeout(() => {
          this.createApprovalChart();
        }, 100);
        this.cdr.detectChanges();
      },
      error: error => console.error(error)
    });
  }

  createDepartmentChart(): void {
    if (!this.departmentReport.length) return;
    const canvasElement = document.getElementById('dashboardDeptChart') as HTMLCanvasElement;
    if (!canvasElement) return;

    if (this.departmentChart) {
      this.departmentChart.destroy();
    }

   const isDark = document.body.classList.contains('dark-theme');
    const textCol = isDark ? '#cbd5e1' : '#475569';
    const gridCol = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
    const labelColor =
  isDark ? '#ffffff' : '#111827';

    this.departmentChart = new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels: this.departmentReport.map(x => x.departmentName),
        datasets: [{
          label: 'Total Visits',
          data: this.departmentReport.map(x => x.totalVisits),
         backgroundColor: [
 '#6366f1',
 '#8b5cf6',
 '#7c3aed',
 '#6d28d9',
 '#5b21b6',
 '#4c1d95'
],
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
  padding: 10
},
       plugins: {

  legend: {
    display: false
  },

  tooltip: {
    padding: 10,
    cornerRadius: 8
  },

  datalabels: {
    color: labelColor,
    anchor: 'end',
    align: 'top',
    offset: 4,
    font: {
      weight: 'bold',
      size: 12
    }
  }

},
        scales: {
          x: {
            grid: { color: gridCol },
            ticks: { color: textCol }
          },
          y: {
  beginAtZero: true,
  suggestedMax:
    Math.max(
      ...this.departmentReport.map(
        x => x.totalVisits
      )
    ) + 20,

          }
        }
      }
    });
  }

  createApprovalChart(): void {
    if (!this.approvalSummary) return;
    const canvasElement = document.getElementById('dashboardApprovalChart') as HTMLCanvasElement;
    if (!canvasElement) return;

    if (this.approvalChart) {
      this.approvalChart.destroy();
    }

    const isDark = document.body.classList.contains('dark-theme');
    const textCol = isDark ? '#cbd5e1' : '#475569';

    this.approvalChart = new Chart(canvasElement, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
          data: [
            this.approvalSummary.approved || 0,
            this.approvalSummary.pending || 0,
            this.approvalSummary.rejected || 0
          ],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: isDark ? 2 : 0,
          borderColor: isDark ? '#151f32' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
  
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textCol,
              padding: 15,
              font: {size: 12 }
            }
          },
          tooltip: {
            padding: 10,
            cornerRadius: 8
          }
        },
        cutout: '65%'
      }
    });
  }
}