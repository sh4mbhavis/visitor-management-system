import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorRequest } from './visitor-request';

describe('VisitorRequest', () => {
  let component: VisitorRequest;
  let fixture: ComponentFixture<VisitorRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
