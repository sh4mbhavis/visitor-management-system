import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private readonly visitorService: VisitorService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.visitorService.getAll().subscribe({

      next: response => {

        console.log('Visitors:', response);

        this.visitors = response;
        this.filteredVisitors = response;

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

          this.filteredVisitors =
            this.filteredVisitors.filter(
              visitor => visitor.visitorId !== id
            );

          this.cdr.detectChanges();

        },

        error: error => {
          console.error(error);
        }

      });

  }

  search(): void {

    const term = this.searchText.toLowerCase();

    this.filteredVisitors =
      this.visitors.filter(visitor =>

        visitor.fullName?.toLowerCase().includes(term) ||

        visitor.email?.toLowerCase().includes(term) ||

        visitor.mobile?.toLowerCase().includes(term)

      );

  }

}