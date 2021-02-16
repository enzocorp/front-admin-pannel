import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPodiumComponent } from './chart-podium.component';

describe('ChartPodiumComponent', () => {
  let component: ChartPodiumComponent;
  let fixture: ComponentFixture<ChartPodiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPodiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPodiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
