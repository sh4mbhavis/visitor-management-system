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
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss'
})
export class AddUserComponent {

  userForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly location: Location
  ) {

    this.userForm = this.fb.group({

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

      password: [
        '',
        Validators.required
      ],

      roleId: [
        '',
        Validators.required
      ],

      departmentId: ['']

    });

  }

  onSubmit(): void {

    if (
      this.userForm.invalid
    ) {
      return;
    }

    this.userService
      .create(
        this.userForm.value
      )
      .subscribe({

        next: () => {

          alert(
            'User created successfully'
          );

          this.router.navigate([
            '/users'
          ]);

        },

        error: error => {

          console.error(error);

          alert(
            'Failed to create user'
          );

        }

      });

  }

  goBack(): void {

  this.location.back();

}
}