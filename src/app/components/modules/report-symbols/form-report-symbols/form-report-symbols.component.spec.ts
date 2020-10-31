import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportSymbolsComponent } from './form-report-symbols.component';

describe('FormReportSymbolsComponent', () => {
  let component: FormReportSymbolsComponent;
  let fixture: ComponentFixture<FormReportSymbolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportSymbolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
