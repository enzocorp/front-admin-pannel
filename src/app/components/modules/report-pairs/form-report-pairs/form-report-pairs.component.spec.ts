import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportPairsComponent } from './form-report-pairs.component';

describe('FormReportPairsComponent', () => {
  let component: FormReportPairsComponent;
  let fixture: ComponentFixture<FormReportPairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportPairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportPairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
