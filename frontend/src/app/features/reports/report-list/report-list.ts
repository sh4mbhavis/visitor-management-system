import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  registerables
} from 'chart.js';

import ChartDataLabels
from 'chartjs-plugin-datalabels';

Chart.register(
  ...registerables
);
Chart.register(
  ...registerables,
  ChartDataLabels
);
import { ReportService } from '../../../core/services/report.service';
import { VisitorService } from '../../../core/services/visitor.service';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss'
})
export class ReportListComponent
  implements OnInit {

  reportDate =
    new Date().toISOString().split('T')[0];

  year =
    new Date().getFullYear();

  month =
    new Date().getMonth() + 1;

visitorName = '';
visitorSuggestions: any[] = [];

  dailyReport: any;

  monthlyReport: any;

  visitorHistory: any[] = [];

  searchedVisitor = false;

  approvalSummary: any;

  departmentReport: any[] = [];

  fromDate =
    new Date().toISOString().split('T')[0];

  toDate =
    new Date().toISOString().split('T')[0];

  dateRangeReport: any;

  approvalChart: any;

departmentChart: any;

  constructor(
  private readonly reportService: ReportService,
  private readonly visitorService: VisitorService,
  private readonly cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {

    this.loadApprovalSummary();

    this.loadDepartmentReport();


  }

  loadDailyReport(): void {

    this.reportService
      .getDailyReport(this.reportDate)
      .subscribe({

        next: response => {

          this.dailyReport = response;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

        }

      });

  }

  loadMonthlyReport(): void {

    this.reportService
      .getMonthlyReport(
        this.year,
        this.month
      )
      .subscribe({

        next: response => {

          this.monthlyReport = response;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

        }

      });

  }

  loadVisitorHistory(): void {

  if (!this.visitorName.trim()) {
    alert('Please enter a visitor name');
    return;
  }
 
  this.searchedVisitor = true;

  this.reportService
    .getVisitorHistoryByName(
      this.visitorName.trim()
    )
    .subscribe({

      next: (response: any) => {

  console.log('Search Term:', this.visitorName);

  console.log('Result Count:', response.length);

  console.log('Visitor History:', response);

  if (response.length > 0) {
    console.log('First Record:', response[0]);
  }

  this.visitorHistory = response;
  this.visitorSuggestions = [];

  this.cdr.detectChanges();

},

      error: error => {

        console.error(error);

      }

    });

}

  loadApprovalSummary(): void {

    this.reportService
      .getApprovalSummary()
      .subscribe({

        next: response => {

          console.log(
            'Approval Summary',
            response
          );

          this.approvalSummary =
            response;

            console.log(
  'Approval Summary Data:',
  this.approvalSummary
);

            setTimeout(() => {

  this.createApprovalChart();

}, 100);

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

        }

      });

  }

  loadDepartmentReport(): void {

    this.reportService
      .getDepartmentReport()
      .subscribe({

        next: (response: any) => {

          console.log(
            'Department Report',
            response
          );

          this.departmentReport =
            response;

            console.log(
  'Department Report Data:',
  this.departmentReport
);

          setTimeout(() => {

  this.createDepartmentChart();

}, 100);

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

        }

      });

  }

  loadDateRangeReport(): void {

    this.reportService
      .getDateRangeReport(
        this.fromDate,
        this.toDate
      )
      .subscribe({

        next: response => {

          this.dateRangeReport =
            response;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

        }

      });

  }

 searchVisitors(): void {

  console.log(
    'Typing:',
    this.visitorName
  );

 if (!this.visitorName.trim()) {

  this.visitorSuggestions = [];

  return;

}
  this.visitorService
    .searchVisitors(
      this.visitorName
    )
    .subscribe({

      next: (response: any) => {

        console.log(
          'Suggestions:',
          response
        );

        this.visitorSuggestions =
          response;

      },

      error: error => {

        console.error(error);

      }

    });

}

selectVisitor(
  visitor: any
): void {

  this.visitorName =
    visitor.fullName;

  this.visitorSuggestions = [];

}

clearVisitorHistory(): void {

  this.visitorName = '';

  this.visitorHistory = [];

  this.visitorSuggestions = [];

  this.searchedVisitor = false;

}

createApprovalChart(): void {

  if (!this.approvalSummary) {
    return;
  }

  if (this.approvalChart) {
    this.approvalChart.destroy();
  }

  this.approvalChart = new Chart(
    'approvalChart',
    {
      type: 'pie',

      data: {

        labels: [
          'Approved',
          'Rejected',
          'Pending'
        ],

        datasets: [
  {
    data: [
      this.approvalSummary.approved,
      this.approvalSummary.rejected,
      this.approvalSummary.pending
    ],

    backgroundColor: [
      '#10b981',
      '#ef4444',
      '#f59e0b'
    ],

    borderWidth: 0
  }
]

 }, 
options: {

  responsive: true,

  maintainAspectRatio: false,

  plugins: {

  legend: {

    position: 'bottom'

  },

  tooltip: {

    callbacks: {

      label: (context: any) => {

        const total =
          context.dataset.data
            .reduce(
              (a: number, b: number) =>
                a + b,
              0
            );

        const percentage =
          (
            context.raw /
            total *
            100
          ).toFixed(1);

        return `${context.label}: ${percentage}%`;

      }

    }

  }

}

}


    }
  );

}

createDepartmentChart(): void {

  if (
    !this.departmentReport.length
  ) {
    return;
  }

  if (this.departmentChart) {
    this.departmentChart.destroy();
  }

 this.departmentChart = new Chart(
  'departmentChart',
  {
    type: 'bar',

    data: {

      labels:
        this.departmentReport.map(
          x => x.departmentName
        ),

      datasets: [
        {
          label: 'Total Visits',

          data:
            this.departmentReport.map(
              x => x.totalVisits
            ),

          backgroundColor:
            '#4f46e5',

          borderRadius: 8,

          borderSkipped: false
        }
      ]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      indexAxis: 'y',

    plugins: {

  legend: {
    display: false
  },

  datalabels: {

    anchor: 'end',

    align: 'right',

    color: '#111827',

    font: {
      weight: 'bold'
    }

  }

}

    }
  }
);
}
}