import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportAssetsComponent } from './form-report-assets.component';

describe('FormReportAssetsComponent', () => {
  let component: FormReportAssetsComponent;
  let fixture: ComponentFixture<FormReportAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
