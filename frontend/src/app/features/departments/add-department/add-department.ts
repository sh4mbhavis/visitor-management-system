import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { DepartmentService } from '../../../core/services/department.service';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-department.html',
  styleUrl: './add-department.scss'
})
export class AddDepartmentComponent {

  departmentForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly departmentService: DepartmentService,
    private readonly router: Router
  ) {

    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required],
      departmentCode: ['']
    });

  }

  onSubmit(): void {

    if (this.departmentForm.invalid) {
      return;
    }

    this.departmentService
      .create(this.departmentForm.value)
      .subscribe({

        next: () => {

          alert(
            'Department created successfully'
          );

          this.router.navigate([
            '/departments'
          ]);

        },

        error: error => {

          console.error(error);

          alert(
            'Failed to create department'
          );

        }

      });

  }

}