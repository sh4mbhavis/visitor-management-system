import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Location } from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.scss'
})
export class EditUserComponent
  implements OnInit {

  userForm: FormGroup;

  userId = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
     private readonly location: Location,
    private readonly userService: UserService
  ) {

    this.userForm = this.fb.group({

      userId: [0],

      fullName: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      mobile: [''],

      roleId: [
        '',
        Validators.required
      ],

      departmentId: [''],

      isActive: [true]

    });

  }

  ngOnInit(): void {

    this.userId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.loadUser();

  }

  loadUser(): void {

    this.userService
      .getById(this.userId)
      .subscribe({

        next: (response: any) => {

          this.userForm.patchValue(response);

        },

        error: error => {

          console.error(error);

        }

      });

  }

  onSubmit(): void {

    if (this.userForm.invalid) {
      return;
    }

    this.userService
      .update(
        this.userId,
        this.userForm.value
      )
      .subscribe({

        next: () => {

          alert(
            'User updated successfully'
          );

          this.router.navigate([
            '/users'
          ]);

        },

        error: error => {

          console.error(error);

          alert(
            'Failed to update user'
          );

        }

      });

  }

  goBack(): void {

  this.location.back();

}

}