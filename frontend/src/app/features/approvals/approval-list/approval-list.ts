import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VisitService } from '../../../core/services/visit.service';
import { ApprovalService } from '../../../core/services/approval.service';

@Component({
  selector: 'app-approval-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './approval-list.html',
  styleUrl: './approval-list.scss'
})
export class ApprovalListComponent implements OnInit {

  visits: any[] = [];
  searchText = '';

filteredVisits: any[] = [];
paginatedVisits: any[] = [];
totalCount = 0;
currentPage = 1;
pageSize = 10;
totalPages = 1;
selectedApprovalDate = '';
selectedStatus = 'all';
sortOrder = 'recent';
pendingCount = 0;
approvedCount = 0;
rejectedCount = 0;

  constructor(
    private readonly visitService: VisitService,
    private readonly approvalService: ApprovalService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadVisits();

  }

  loadVisits(): void {

    this.visitService.getAll()
      .subscribe({

        next: response => {

         this.visits = response;
         this.totalCount = response.length;

this.pendingCount =
  response.filter(
    (v: any) =>
      v.approvalStatus ===
      'Pending'
  ).length;

this.approvedCount =
  response.filter(
    (v: any) =>
      v.approvalStatus ===
      'Approved'
  ).length;

this.rejectedCount =
  response.filter(
    (v: any) =>
      v.approvalStatus ===
      'Rejected'
  ).length;

this.applyFilters();

          this.cdr.detectChanges();

        },

        error: error => {
          console.error(error);
        }

      });

  }

  approve(visit: any): void {

    const payload = {
      visitId: visit.visitId,
      approverUserId: 1,
      remarks: 'Approved'
    };

    this.approvalService
      .approve(
        visit.visitId,
        payload
      )
      .subscribe({

        next: () => {

          alert('Visit approved');

          this.loadVisits();

        },

        error: error => {
          console.error(error);
        }

      });

  }

  reject(visit: any): void {

  const payload = {
    visitId: visit.visitId,
    approverUserId: 1,
    remarks: 'Rejected'
  };

  this.approvalService
    .reject(
      visit.visitId,
      payload
    )
    .subscribe({

      next: () => {

        alert('Visit rejected');

        this.loadVisits();

      },

      error: error => {
        console.error(error);
      }

    });

}

  reset(visit: any): void {

  const payload = {
    visitId: visit.visitId,
    approverUserId: 1,
    remarks: 'Reverted to pending'
  };

  this.approvalService
    .reset(
      visit.visitId,
      payload
    )
    .subscribe({

      next: () => {

        alert(
          'Approval reverted'
        );

        this.loadVisits();

      },

      error: error => {
        console.error(error);
      }

    });

}
search(): void {

  this.currentPage = 1;

  this.applyFilters();

}

changePage(page: number): void {

  if (
    page < 1 ||
    page > this.totalPages
  ) {
    return;
  }

  this.currentPage = page;

  this.updatePagination();

}

changePageSize(): void {

  this.currentPage = 1;

  this.applyFilters();

}

applyFilters(): void {

  let data = [...this.visits];

  const term =
    this.searchText.toLowerCase();

  if (term) {

    data = data.filter(
      visit =>

        visit.visitorFullName
          ?.toLowerCase()
          .includes(term)

        ||

        visit.departmentName
          ?.toLowerCase()
          .includes(term)

        ||

        visit.purpose
          ?.toLowerCase()
          .includes(term)

    );

  }

  if (
    this.selectedStatus !== 'all'
  ) {

    data = data.filter(
      visit =>
        visit.approvalStatus ===
        this.selectedStatus
    );

  }

  if (this.selectedApprovalDate) {

  data = data.filter(item => {

    if (!item.visitDate) {
      return false;
    }

    return (
      new Date(item.visitDate)
        .toISOString()
        .split('T')[0]

      ===

      this.selectedApprovalDate
    );

  });

}

data.sort((a, b) => {

  const dateA = a.visitDate
    ? new Date(a.visitDate).getTime()
    : 0;

  const dateB = b.visitDate
    ? new Date(b.visitDate).getTime()
    : 0;

  return this.sortOrder === 'recent'
    ? dateB - dateA
    : dateA - dateB;

});

  this.filteredVisits = data;

  this.updatePagination();

}

updatePagination(): void {

  this.totalPages =
    Math.ceil(
      this.filteredVisits.length /
      this.pageSize
    ) || 1;

  const start =
    (this.currentPage - 1)
    *
    this.pageSize;

  this.paginatedVisits =
    this.filteredVisits.slice(
      start,
      start + this.pageSize
    );

}

clearDateFilter(): void {

  this.selectedApprovalDate = '';

  this.applyFilters();

}

}