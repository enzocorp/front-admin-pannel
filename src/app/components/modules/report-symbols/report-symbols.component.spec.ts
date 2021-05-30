import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSymbolsComponent } from './report-symbols.component';

describe('ReportSymbolsComponent', () => {
  let component: ReportSymbolsComponent;
  let fixture: ComponentFixture<ReportSymbolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSymbolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
