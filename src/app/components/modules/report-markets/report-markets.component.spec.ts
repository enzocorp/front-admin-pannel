import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMarketsComponent } from './report-markets.component';

describe('ReportMarketsComponent', () => {
  let component: ReportMarketsComponent;
  let fixture: ComponentFixture<ReportMarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMarketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
