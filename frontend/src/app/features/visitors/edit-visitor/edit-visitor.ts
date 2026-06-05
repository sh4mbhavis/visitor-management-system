import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { VisitorService } from '../../../core/services/visitor.service';

@Component({
  selector: 'app-edit-visitor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-visitor.html',
  styleUrl: './edit-visitor.scss'
})
export class EditVisitorComponent implements OnInit {

  visitorId = 0;

  visitorForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly visitorService: VisitorService
  ) {

    this.visitorForm = this.fb.group({
      visitorId: [0],
      fullName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: [''],
      gender: [''],
      address: [''],
      idProofType: [''],
      idProofNumber: ['']
    });

  }

  ngOnInit(): void {

    this.visitorId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.visitorService
      .getById(this.visitorId)
      .subscribe((visitor: any) => {

        this.visitorForm.patchValue(visitor);

      });

  }

  onSubmit(): void {

    if (this.visitorForm.invalid) {
      return;
    }

    this.visitorService
      .update(
        this.visitorId,
        this.visitorForm.value
      )
      .subscribe({
        next: () => {

          alert('Visitor updated successfully');

          this.router.navigate(['/visitors']);

        },
        error: error => {
          console.error(error);
          alert('Update failed');
        }
      });

  }
}