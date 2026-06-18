import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { VisitorService } from '../../../core/services/visitor.service';

@Component({
  selector: 'app-add-visitor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-visitor.html',
  styleUrl: './add-visitor.scss'
})
export class AddVisitorComponent {

  visitorForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly visitorService: VisitorService,
    private readonly router: Router,
      private readonly location: Location,
  ) {

    this.visitorForm = this.fb.group({
      fullName: ['', Validators.required],
      mobile: [
  '',
  [
    Validators.required,
    Validators.pattern('^[0-9]{10}$')
  ]
],
      email: ['', Validators.email],
      gender: [''],
      address: [''],
      idProofType: [''],
      idProofNumber: ['']
    });

  }

  onSubmit(): void {

    if (this.visitorForm.invalid) {
      return;
    }

    this.visitorService.create(this.visitorForm.value)
      .subscribe({
        next: () => {
          alert('Visitor created successfully');
          this.router.navigate(['/visitors']);
        },
        error: error => {
          console.error(error);
          alert('Failed to create visitor');
        }
      });
  }

  goBack(): void {

  this.location.back();

}
}