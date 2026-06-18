import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent
  implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];

searchText = '';

selectedRole = 'all';
availableRoles: string[] = [];
selectedStatus = 'all';

sortOrder = 'nameAsc';

totalUsers = 0;
activeUsers = 0;
inactiveUsers = 0;

adminCount = 0;
securityCount = 0;
facultyCount = 0;
receptionistCount = 0;

  constructor(
    private readonly userService: UserService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadUsers();

  }

  loadUsers(): void {

    this.userService.getAll()
      .subscribe({

        next: response => {

         this.users = response;

         this.availableRoles = [
  ...new Set(
    response.map(
      user => user.roleName
    )
  )
];

this.totalUsers = response.length;

this.activeUsers =
  response.filter(x => x.isActive).length;

this.inactiveUsers =
  response.filter(x => !x.isActive).length;

this.adminCount =
  response.filter(
    x => x.roleName === 'Admin'
  ).length;

this.securityCount =
  response.filter(
    x => x.roleName === 'Security'
  ).length;

this.facultyCount =
  response.filter(
    x => x.roleName === 'Faculty'
  ).length;

this.receptionistCount =
  response.filter(
    x => x.roleName === 'Receptionist'
  ).length;

this.applyFilters();

this.cdr.detectChanges();
        },

        error: error => {

          console.error(error);

        }

      });

  }

  deleteUser(
    id: number
  ): void {

    if (
      !confirm(
        'Delete this user?'
      )
    ) {
      return;
    }

    this.userService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadUsers();

        },

        error: error => {

          console.error(error);

        }

      });

  }

  applyFilters(): void {

  let data = [...this.users];

  const term =
    this.searchText.toLowerCase();

  if (term) {

    data = data.filter(user =>

      user.fullName
        ?.toLowerCase()
        .includes(term)

      ||

      user.email
        ?.toLowerCase()
        .includes(term)

      ||

      user.mobile
        ?.toLowerCase()
        .includes(term)

    );

  }

if (
  this.selectedRole !== 'all'
) {

  data = data.filter(
    user =>
      user.roleName ===
      this.selectedRole
  );

}

  if (
    this.selectedStatus !== 'all'
  ) {

    data = data.filter(
      user =>

        this.selectedStatus ===
        'active'

          ? user.isActive

          : !user.isActive

    );

  }

  switch (this.sortOrder) {

    case 'nameAsc':

      data.sort((a, b) =>
        a.fullName.localeCompare(
          b.fullName
        )
      );

      break;

    case 'nameDesc':

      data.sort((a, b) =>
        b.fullName.localeCompare(
          a.fullName
        )
      );

      break;

  }

  this.filteredUsers = data;

}

}