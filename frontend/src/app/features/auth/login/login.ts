import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
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

constructor(
  private readonly fb: FormBuilder,
  private readonly authService: AuthService,
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

  this.authService.login({
    email: this.loginForm.value.email ?? '',
    password: this.loginForm.value.password ?? ''
  }).subscribe({
      next: response => {
  localStorage.setItem('token', response.token);
  localStorage.setItem('role', response.role);

  this.router.navigate(['/dashboard']);
},
      error: error => {
        console.error('Login failed', error);
      }
    });
  }
}