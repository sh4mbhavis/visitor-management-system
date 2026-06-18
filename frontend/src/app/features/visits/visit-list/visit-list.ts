import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VisitService } from '../../../core/services/visit.service';
import { Visit } from '../../../core/models/visit.model';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.scss'
})
export class VisitListComponent implements OnInit {

  visits: Visit[] = [];
  searchText = '';

filteredVisits: Visit[] = [];
paginatedVisits: Visit[] = [];
totalVisits = 0;
approvedVisits = 0;
pendingVisits = 0;
checkedOutVisits = 0;
currentPage = 1;
pageSize = 10;
totalPages = 1;
sortOrder = 'recent';
sortByDateAscending = false;
selectedVisitDate = '';
selectedDateFilter = 'all';
selectedApprovalFilter = 'all';

trackByVisit(index: number, visit: Visit): number {
  return visit.visitId;
}

  constructor(
    private readonly visitService: VisitService,
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
        this.totalVisits = response.length;

this.approvedVisits =
  response.filter(
    visit =>
      visit.approvalStatus ===
      'Approved'
  ).length;

this.pendingVisits =
  response.filter(
    visit =>
      visit.approvalStatus ===
      'Pending'
  ).length;

this.checkedOutVisits =
  response.filter(
    visit =>
      visit.visitStatusName ===
      'CheckedOut'
  ).length;

        this.applyFilters();

        this.cdr.detectChanges();

      },

      error: error => {
        console.error(error);
      }

    });

}

  deleteVisit(id: number): void {

    if (!confirm('Delete this visit?')) {
      return;
    }

    this.visitService.delete(id)
      .subscribe({

        next: () => {

          this.visits =
            this.visits.filter(
              visit => visit.visitId !== id
            );

          this.cdr.detectChanges();

        },

        error: error => {
          console.error(error);
        }

      });

  }

  checkIn(id: number): void {

    this.visitService.checkIn(id)
      .subscribe({
        next: () => this.loadVisits(),
        error: error => console.error(error)
      });

  }

  checkOut(id: number): void {

    this.visitService.checkOut(id)
      .subscribe({
        next: () => this.loadVisits(),
        error: error => console.error(error)
      });

  }

  downloadGatePass(
  visit: Visit
): void {

  this.visitService
    .downloadGatePass(
      visit.visitId
    )
    .subscribe({

      next: blob => {

        const url =
          window.URL.createObjectURL(
            blob
          );

        const a =
          document.createElement('a');

        a.href = url;

        a.download =
          `GatePass-${
            visit.gatePassNumber
          }.pdf`;

        a.click();

        window.URL
          .revokeObjectURL(url);

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

    data = data.filter(visit =>

      visit.visitorFullName
        ?.toLowerCase()
        .includes(term)

      ||

      visit.hostUserFullName
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
    this.selectedApprovalFilter !== 'all'
  ) {

    data = data.filter(
      visit =>
        visit.approvalStatus ===
        this.selectedApprovalFilter
    );

  }

  if (this.selectedVisitDate) {

  data = data.filter(visit => {

    if (!visit.visitDate) {
      return false;
    }

    return (
      new Date(visit.visitDate)
        .toISOString()
        .split('T')[0]

      ===

      this.selectedVisitDate
    );

  });

}

  const today = new Date();

  if (
    this.selectedDateFilter === 'today'
  ) {

    data = data.filter(visit => {

      if (!visit.visitDate) {
        return false;
      }

      return (
        new Date(
          visit.visitDate
        ).toDateString()

        ===

        today.toDateString()
      );

    });

  }

  if (
    this.selectedDateFilter === 'month'
  ) {

    data = data.filter(visit => {

      if (!visit.visitDate) {
        return false;
      }

      const date =
        new Date(
          visit.visitDate
        );

      return (

        date.getMonth() ===
        today.getMonth()

        &&

        date.getFullYear() ===
        today.getFullYear()

      );

    });

  }

  if (
    this.selectedDateFilter === 'year'
  ) {

    data = data.filter(visit => {

      if (!visit.visitDate) {
        return false;
      }

      return (

        new Date(
          visit.visitDate
        ).getFullYear()

        ===

        today.getFullYear()

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

    console.log(this.paginatedVisits);

}

sortByDate(order: string): void {

  this.filteredVisits.sort((a, b) => {

    const dateA =
      a.visitDate
        ? new Date(a.visitDate).getTime()
        : 0;

    const dateB =
      b.visitDate
        ? new Date(b.visitDate).getTime()
        : 0;

    return order === 'recent'
      ? dateB - dateA
      : dateA - dateB;

  });

  this.updatePagination();

}

clearDateFilter(): void {

  this.selectedVisitDate = '';

  this.applyFilters();

}

}