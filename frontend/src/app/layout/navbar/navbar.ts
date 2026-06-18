import {
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent
implements OnInit {

  isDarkMode = false;

  constructor(
    private readonly router: Router
  ) {}

  ngOnInit(): void {

    const theme =
      localStorage.getItem(
        'theme'
      );

    if (theme === 'dark') {

      this.isDarkMode = true;

      document.body.classList.add(
        'dark-theme'
      );

    }

  }

  toggleTheme(): void {

    this.isDarkMode =
      !this.isDarkMode;

    if (this.isDarkMode) {

      document.body.classList.add(
        'dark-theme'
      );

      localStorage.setItem(
        'theme',
        'dark'
      );

    } else {

      document.body.classList.remove(
        'dark-theme'
      );

      localStorage.setItem(
        'theme',
        'light'
      );

    }

  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.router.navigate([
      '/login'
    ]);

  }

}