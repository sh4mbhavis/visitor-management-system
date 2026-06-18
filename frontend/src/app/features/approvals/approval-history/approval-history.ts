import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import {
  ActivatedRoute
} from '@angular/router';

import { ApprovalService } from '../../../core/services/approval.service';

@Component({
  selector: 'app-approval-history',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './approval-history.html',
  styleUrl: './approval-history.scss'
})
export class ApprovalHistoryComponent
  implements OnInit {

  visitId = 0;

  approvals: any[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly approvalService: ApprovalService,
    private readonly cdr: ChangeDetectorRef,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {

    this.visitId =
      Number(
        this.route.snapshot.paramMap.get(
          'visitId'
        )
      );

    this.loadHistory();

  }

  loadHistory(): void {

    this.approvalService
      .getByVisitId(
        this.visitId
      )
      .subscribe({

        next: response => {

          this.approvals = response as any[];

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

        }

      });

  }
  goBack(): void {

  this.location.back();

}

}