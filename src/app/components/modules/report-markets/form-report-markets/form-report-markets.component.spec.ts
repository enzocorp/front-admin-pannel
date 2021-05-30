import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportMarketsComponent } from './form-report-markets.component';

describe('FormReportMarketsComponent', () => {
  let component: FormReportMarketsComponent;
  let fixture: ComponentFixture<FormReportMarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportMarketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
