import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  constructor(
    private readonly router: Router
  ) {}

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}