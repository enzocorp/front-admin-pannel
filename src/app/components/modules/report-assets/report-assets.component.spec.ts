import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAssetsComponent } from './report-assets.component';

describe('ReportAssetsComponent', () => {
  let component: ReportAssetsComponent;
  let fixture: ComponentFixture<ReportAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
