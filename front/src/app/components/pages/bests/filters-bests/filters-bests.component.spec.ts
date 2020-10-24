import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersBestsComponent } from './filters-bests.component';

describe('FiltersBestsComponent', () => {
  let component: FiltersBestsComponent;
  let fixture: ComponentFixture<FiltersBestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersBestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersBestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
