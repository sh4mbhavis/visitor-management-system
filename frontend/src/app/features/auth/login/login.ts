import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { VisitorAuthService } from '../../../core/services/visitor-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm;
  loginType: 'staff' | 'visitor' = 'staff';

constructor(
  private readonly fb: FormBuilder,
  private readonly authService: AuthService,
  private readonly visitorAuthService: VisitorAuthService,
  private readonly router: Router
) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
}

 onSubmit(): void {
  console.log('LOGIN CLICKED');

  if (this.loginForm.invalid) {
    return;
  }

const request = {

  email:
    this.loginForm.value.email ?? '',

  password:
    this.loginForm.value.password ?? ''

};

if (this.loginType === 'staff') {

  this.authService
    .login(request)
    .subscribe({

      next: response => {

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'role',
          response.role
        );

        localStorage.setItem(
          'userId',
          response.userId.toString()
        );

        localStorage.setItem(
          'fullName',
          response.fullName
        );

        this.router.navigate([
          '/dashboard'
        ]);

      },

      error: error => {

        console.error(
          'Staff Login Failed',
          error
        );

      }

    });

}
else {

  this.visitorAuthService
    .login(request)
    .subscribe({

      next: response => {

        localStorage.setItem(
          'visitorToken',
          response.token
        );

        localStorage.setItem(
          'visitorId',
          response.visitorId.toString()
        );

        localStorage.setItem(
          'visitorName',
          response.fullName
        );

        this.router.navigate([
          '/visitor-dashboard'
        ]);

      },

      error: error => {

        console.error(
          'Visitor Login Failed',
          error
        );

      }

    });

}
  }
}