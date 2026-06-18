import { Component } from '@angular/core';

@Component({
  selector: 'app-visitor-dashboard',
  imports: [],
  templateUrl: './visitor-dashboard.html',
  styleUrl: './visitor-dashboard.scss',
})
export class VisitorDashboardComponent {

  visitorName =
    localStorage.getItem(
      'visitorName'
    ) ?? 'Visitor';

}