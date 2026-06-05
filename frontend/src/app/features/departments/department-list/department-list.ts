import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss'
})
export class DepartmentListComponent implements OnInit {

  searchText = '';

  departments: Department[] = [];
  filteredDepartments: Department[] = [];

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.departmentService.getAll().subscribe({

      next: response => {

        console.log('Departments:', response);

        this.departments = response;
        this.filteredDepartments = response;

        this.cdr.detectChanges();

      },

      error: error => {
        console.error(error);
      }

    });

  }

  search(): void {

    const term = this.searchText.toLowerCase();

    this.filteredDepartments =
      this.departments.filter(department =>

        department.departmentName
          ?.toLowerCase()
          .includes(term)

        ||

        department.departmentCode
          ?.toLowerCase()
          .includes(term)

      );

  }

  deleteDepartment(id: number): void {

    if (!confirm('Delete this department?')) {
      return;
    }

    this.departmentService.delete(id)
      .subscribe({

        next: () => {

          this.departments =
            this.departments.filter(
              d => d.departmentId !== id
            );

          this.filteredDepartments =
            this.filteredDepartments.filter(
              d => d.departmentId !== id
            );

          this.cdr.detectChanges();

        },

        error: error => {
          console.error(error);
        }

      });

  }

}