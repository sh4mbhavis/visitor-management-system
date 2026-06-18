import {
Component,
OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { VisitorService } from '../../../core/services/visitor.service';
import { Visitor } from '../../../core/models/visitor.model';

@Component({
selector: 'app-visitor-list',
standalone: true,
imports: [
CommonModule,
RouterLink,
FormsModule
],
templateUrl: './visitor-list.html',
styleUrl: './visitor-list.scss'
})
export class VisitorListComponent implements OnInit {

searchText = '';

visitors: Visitor[] = [];
filteredVisitors: Visitor[] = [];
paginatedVisitors: Visitor[] = [];

currentPage = 1;
pageSize = 10;
totalPages = 1;

selectedFilter = 'all';
sortOrder = 'recent';
sortField = 'visitorId';
sortDirection: 'asc' | 'desc' = 'asc';

constructor(
  private readonly visitorService: VisitorService,
  private readonly cdr: ChangeDetectorRef
) {}
ngOnInit(): void {


this.loadVisitors();


}

loadVisitors(): void {

  this.visitorService.getAll().subscribe({

    next: response => {

      this.visitors = [...response];

      this.currentPage = 1;

      this.filteredVisitors = [...response];

      this.updatePagination();

      this.cdr.detectChanges();

    },

    error: error => {
      console.error(error);
    }

  });

}
deleteVisitor(id: number): void {

if (!confirm('Delete this visitor?')) {
  return;
}

this.visitorService.delete(id)
  .subscribe({

    next: () => {

      this.visitors =
        this.visitors.filter(
          visitor => visitor.visitorId !== id
        );

      this.applyFilters();

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

changeFilter(filter: string): void {


this.selectedFilter = filter;

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

sort(field: string): void {


if (this.sortField === field) {

  this.sortDirection =
    this.sortDirection === 'asc'
      ? 'desc'
      : 'asc';

} else {

  this.sortField = field;
  this.sortDirection = 'asc';

}

this.applyFilters();


}

applyFilters(): void {


let data = [...this.visitors];

const term = this.searchText.toLowerCase();

if (term) {

  data = data.filter(visitor =>

    visitor.fullName?.toLowerCase().includes(term) ||

    visitor.email?.toLowerCase().includes(term) ||

    visitor.mobile?.toLowerCase().includes(term)

  );

}

const today = new Date();

if (this.selectedFilter === 'today') {

  data = data.filter(visitor => {

    if (!visitor.createdAt) {
      return false;
    }

    const date =
      new Date(visitor.createdAt);

    return (
      date.toDateString() ===
      today.toDateString()
    );

  });

}

if (this.selectedFilter === 'month') {

  data = data.filter(visitor => {

    if (!visitor.createdAt) {
      return false;
    }

    const date =
      new Date(visitor.createdAt);

    return (
      date.getMonth() === today.getMonth()
      &&
      date.getFullYear() === today.getFullYear()
    );

  });

}

if (this.selectedFilter === 'year') {

  data = data.filter(visitor => {

    if (!visitor.createdAt) {
      return false;
    }

    const date =
      new Date(visitor.createdAt);

    return (
      date.getFullYear() ===
      today.getFullYear()
    );

  });

}

data.sort((a: any, b: any) => {

  const valueA =
    a[this.sortField];

  const valueB =
    b[this.sortField];

  if (valueA < valueB) {
    return this.sortDirection === 'asc'
      ? -1
      : 1;
  }

  if (valueA > valueB) {
    return this.sortDirection === 'asc'
      ? 1
      : -1;
  }

  return 0;

});

data.sort((a, b) => {

  const dateA = a.createdAt
    ? new Date(a.createdAt).getTime()
    : 0;

  const dateB = b.createdAt
    ? new Date(b.createdAt).getTime()
    : 0;

  return this.sortOrder === 'recent'
    ? dateB - dateA
    : dateA - dateB;

});

this.filteredVisitors = data;

this.updatePagination();


}

updatePagination(): void {

this.totalPages =
  Math.ceil(
    this.filteredVisitors.length /
    this.pageSize
  ) || 1;

const start =
  (this.currentPage - 1) *
  this.pageSize;

const end =
  start + this.pageSize;

this.paginatedVisitors =
  this.filteredVisitors.slice(
    start,
    end
  );

}

}
