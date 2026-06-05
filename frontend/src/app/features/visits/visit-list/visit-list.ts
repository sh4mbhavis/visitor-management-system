import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.scss'
})
export class VisitListComponent {

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {}

}