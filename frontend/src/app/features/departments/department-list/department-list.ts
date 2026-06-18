import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { VisitService } from '../../../core/services/visit.service';
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
  totalDepartments = 0;

departmentsWithUsers = 0;

departmentsWithVisits = 0;

departmentsWithoutActivity = 0;

sortOrder = 'nameAsc';

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly cdr: ChangeDetectorRef,
    private readonly userService: UserService,
private readonly visitService: VisitService,
  ) {}

  ngOnInit(): void {

    this.departmentService.getAll().subscribe({

      next: response => {

        console.log('Departments:', response);

        this.departments = response;
this.filteredDepartments = response;

this.totalDepartments =
  response.length;

this.loadDepartmentStats();

        this.cdr.detectChanges();

      },

      error: error => {
        console.error(error);
      }

    });

  }

 search(): void {

  let data = [...this.departments];

  const term =
    this.searchText.toLowerCase();

  if (term) {

    data = data.filter(
      department =>

        department.departmentName
          ?.toLowerCase()
          .includes(term)

        ||

        department.departmentCode
          ?.toLowerCase()
          .includes(term)

    );

  }

  data.sort((a, b) =>

    this.sortOrder === 'nameAsc'

      ? a.departmentName.localeCompare(
          b.departmentName
        )

      : b.departmentName.localeCompare(
          a.departmentName
        )

  );

  this.filteredDepartments = data;

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

            this.totalDepartments =
  this.departments.length;

this.loadDepartmentStats();

          this.cdr.detectChanges();

        },

        error: error => {
          console.error(error);
        }

      });

  }
loadDepartmentStats(): void {

  this.userService.getAll()
    .subscribe(users => {

      this.visitService.getAll()
        .subscribe(visits => {

          console.log('Users:', users);
          console.log('Visits:', visits);

          console.log(
            users.map(user => ({
              name: user.fullName,
              departmentId: user.departmentId
            }))
          );

          console.log(
            visits.map(visit => ({
              visitId: visit.visitId,
              departmentId: visit.departmentId,
              departmentName: visit.departmentName
            }))
          );

          const departmentsWithUsers =
            new Set(
              users
                .filter(user =>
                  user.departmentId != null
                )
                .map(user =>
                  Number(user.departmentId)
                )
            );

          const departmentsWithVisits =
            new Set(
              visits
                .filter(visit =>
                  visit.departmentId != null
                )
                .map(visit =>
                  Number(visit.departmentId)
                )
            );

          console.log(
            'Departments With Users Set:',
            departmentsWithUsers
          );

          console.log(
            'Departments With Visits Set:',
            departmentsWithVisits
          );
          console.log(
  departmentsWithUsers.size,
  departmentsWithVisits.size
);

          this.departmentsWithUsers =
            departmentsWithUsers.size;

          this.departmentsWithVisits =
            departmentsWithVisits.size;

          this.departmentsWithoutActivity =
            this.departments.filter(
              department =>

                !departmentsWithUsers.has(
                  department.departmentId
                )

                &&

                !departmentsWithVisits.has(
                  department.departmentId
                )

            ).length;
            
            console.log('With Users:', this.departmentsWithUsers);
console.log('With Visits:', this.departmentsWithVisits);
console.log('Without Activity:', this.departmentsWithoutActivity);

this.cdr.detectChanges();

          console.log(
            'No Activity:',
            this.departmentsWithoutActivity
          );

        });

    });

}

}
