import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { VisitService } from '../../../core/services/visit.service';
import { VisitorService } from '../../../core/services/visitor.service';
import { UserService } from '../../../core/services/user.service';
import { DepartmentService } from '../../../core/services/department.service';


@Component({
  selector: 'app-add-visit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-visit.html',
  styleUrl: './add-visit.scss'
})
export class AddVisitComponent {

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

    this.loadDropdowns();
  }

  loadDropdowns(): void {

    this.visitorService.getAll()
  .subscribe(data => {

    console.log('Visitors:', data);

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

  onSubmit(): void {

    if (this.visitForm.invalid) {
      return;
    }

    this.visitService
      .create(this.visitForm.value)
      .subscribe({

        next: () => {

          alert('Visit created successfully');

          this.router.navigate([
            '/visits'
          ]);

        },

        error: error => {

          console.error(error);

          alert(
            'Failed to create visit'
          );

        }

      });

  }

  goBack(): void {

  this.location.back();

}

}