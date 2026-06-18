import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { DepartmentService }
from '../../../core/services/department.service';

import { UserService }
from '../../../core/services/user.service';

import { VisitService }
from '../../../core/services/visit.service';

@Component({
  selector: 'app-visitor-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './visitor-request.html',
  styleUrl: './visitor-request.scss'
})
export class VisitorRequestComponent
implements OnInit {

  requestForm!: FormGroup;

  departments: any[] = [];

  faculty: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
    private readonly visitService: VisitService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {

    this.requestForm =
      this.fb.group({

        departmentId: [
          '',
          Validators.required
        ],

        hostUserId: [
          '',
          Validators.required
        ],

        visitDate: [
          '',
          Validators.required
        ],

        purpose: [
          '',
          Validators.required
        ]

      });

    this.loadDepartments();

    this.loadFaculty();
  }

  private loadDepartments(): void {

    this.departmentService
      .getAll()
      .subscribe(data => {

        this.departments = data;

      });

  }

  private loadFaculty(): void {

    this.userService
      .getFaculty()
      .subscribe(data => {

        this.faculty = data;

      });

  }

  onSubmit(): void {

    if (this.requestForm.invalid) {
      return;
    }

    const visitorId =
      Number(
        localStorage.getItem(
          'visitorId'
        )
      );

    const request = {

      visitorId,

      departmentId:
        Number(
          this.requestForm.value.departmentId
        ),

      hostUserId:
        Number(
          this.requestForm.value.hostUserId
        ),

      visitDate:
        this.requestForm.value.visitDate,

      purpose:
        this.requestForm.value.purpose

    };

    console.log(request);

    this.visitService
      .create(request)
      .subscribe({

        next: () => {

          alert(
            'Visit request submitted successfully.'
          );

          this.router.navigate([
            '/visitor-dashboard'
          ]);

        },

        error: error => {

          console.error(error);

        }

      });

  }

}