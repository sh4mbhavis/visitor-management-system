import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { VisitService } from '../../../core/services/visit.service';
import { VisitorService } from '../../../core/services/visitor.service';
import { UserService } from '../../../core/services/user.service';
import { DepartmentService } from '../../../core/services/department.service';

@Component({
  selector: 'app-edit-visit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-visit.html',
  styleUrl: './edit-visit.scss'
})
export class EditVisitComponent implements OnInit {

  visitId = 0;

  visitForm: FormGroup;

  visitors: any[] = [];
  users: any[] = [];
  departments: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly visitService: VisitService,
    private readonly visitorService: VisitorService,
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly location: Location,
  ) {

    this.visitForm = this.fb.group({
      visitorId: ['', Validators.required],
      hostUserId: ['', Validators.required],
      departmentId: ['', Validators.required],
      purpose: [''],
      visitDate: ['', Validators.required]
    });

  }

  ngOnInit(): void {

    this.visitId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.loadDropdowns();
    this.loadVisit();

  }

  loadDropdowns(): void {

    this.visitorService.getAll()
      .subscribe(data => {
        this.visitors = data;
        this.cdr.detectChanges();
      });

    this.userService.getAll()
      .subscribe(data => {
        this.users = data;
        this.cdr.detectChanges();
      });

    this.departmentService.getAll()
      .subscribe(data => {
        this.departments = data;
        this.cdr.detectChanges();
      });

  }

  loadVisit(): void {

    this.visitService
      .getById(this.visitId)
      .subscribe({

        next: (visit: any) => {

          this.visitForm.patchValue({

            visitorId:
              visit.visitorId,

            hostUserId:
              visit.hostUserId,

            departmentId:
              visit.departmentId,

            purpose:
              visit.purpose,

            visitDate:
              visit.visitDate
                ?.substring(0, 10)

          });

          this.cdr.detectChanges();

        },

        error: error => {
          console.error(error);
        }

      });

  }

  onSubmit(): void {

    if (this.visitForm.invalid) {
      return;
    }

    const payload = {

      visitId: this.visitId,

      visitorId:
        this.visitForm.value.visitorId,

      hostUserId:
        this.visitForm.value.hostUserId,

      departmentId:
        this.visitForm.value.departmentId,

      purpose:
        this.visitForm.value.purpose,

      visitDate:
        this.visitForm.value.visitDate,

      visitStatusId: 1,
      approvalStatus: 'Pending'

    };

    this.visitService
      .update(
        this.visitId,
        payload
      )
      .subscribe({

        next: () => {

          alert(
            'Visit updated successfully'
          );

          this.router.navigate([
            '/visits'
          ]);

        },

        error: error => {

          console.error(error);

          alert(
            'Failed to update visit'
          );

        }

      });

  }
  goBack(): void {

  this.location.back();

}

}