import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  AddVisitComponent } from './add-visit';

describe('AddVisit', () => {
  let component: AddVisitComponent;
  let fixture: ComponentFixture<AddVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVisitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
