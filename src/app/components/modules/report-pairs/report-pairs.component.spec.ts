import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPairsComponent } from './report-pairs.component';

describe('ReportPairsComponent', () => {
  let component: ReportPairsComponent;
  let fixture: ComponentFixture<ReportPairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
