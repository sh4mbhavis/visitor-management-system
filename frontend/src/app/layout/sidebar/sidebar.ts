import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  role =
    localStorage.getItem('role');

  fullName =
    localStorage.getItem('fullName');

  isCollapsed = false;

  toggleSidebar(): void {

    this.isCollapsed =
      !this.isCollapsed;

    localStorage.setItem(
      'sidebarCollapsed',
      this.isCollapsed.toString()
    );

    document.body.classList.toggle(
      'sidebar-collapsed',
      this.isCollapsed
    );
  }

  ngOnInit(): void {

    this.isCollapsed =
      localStorage.getItem(
        'sidebarCollapsed'
      ) === 'true';

    if (this.isCollapsed) {

      document.body.classList.add(
        'sidebar-collapsed'
      );

    }

  }
}