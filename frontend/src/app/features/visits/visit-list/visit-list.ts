import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { VisitService } from '../../../core/services/visit.service';
import { Visit } from '../../../core/models/visit.model';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.scss'
})
export class VisitListComponent implements OnInit {

  visits: Visit[] = [];

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

}