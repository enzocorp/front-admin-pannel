import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBestComponent } from './chart-best.component';

describe('ChartBestComponent', () => {
  let component: ChartBestComponent;
  let fixture: ComponentFixture<ChartBestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
