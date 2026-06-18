import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorDashboard } from './visitor-dashboard';

describe('VisitorDashboard', () => {
  let component: VisitorDashboard;
  let fixture: ComponentFixture<VisitorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
