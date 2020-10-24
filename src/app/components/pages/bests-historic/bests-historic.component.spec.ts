import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestsHistoricComponent } from './bests-historic.component';

describe('BestsHistoryComponent', () => {
  let component: BestsHistoricComponent;
  let fixture: ComponentFixture<BestsHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestsHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestsHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
