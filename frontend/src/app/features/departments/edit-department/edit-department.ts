import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

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

import { DepartmentService } from '../../../core/services/department.service';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-department.html',
  styleUrl: './edit-department.scss'
})
export class EditDepartmentComponent implements OnInit {

  departmentId = 0;

  departmentForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly departmentService: DepartmentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {

    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required],
      departmentCode: ['']
    });

  }

  ngOnInit(): void {

    this.departmentId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.departmentService
      .getById(this.departmentId)
      .subscribe({

        next: (department: any) => {

          this.departmentForm.patchValue({
            departmentName:
              department.departmentName,

            departmentCode:
              department.departmentCode
          });

        },

        error: error => {
          console.error(error);
        }

      });

  }

  onSubmit(): void {

    if (this.departmentForm.invalid) {
      return;
    }

    const payload = {

      departmentId: this.departmentId,

      departmentName:
        this.departmentForm.value.departmentName,

      departmentCode:
        this.departmentForm.value.departmentCode

    };

    this.departmentService
      .update(
        this.departmentId,
        payload
      )
      .subscribe({

        next: () => {

          alert(
            'Department updated successfully'
          );

          this.router.navigate([
            '/departments'
          ]);

        },

        error: error => {

          console.error(error);

          alert(
            'Failed to update department'
          );

        }

      });

  }

}