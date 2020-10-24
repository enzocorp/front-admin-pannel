import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPairsComponent } from './filters-pairs.component';

describe('FiltersComponent', () => {
  let component: FiltersPairsComponent;
  let fixture: ComponentFixture<FiltersPairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersPairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersPairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
