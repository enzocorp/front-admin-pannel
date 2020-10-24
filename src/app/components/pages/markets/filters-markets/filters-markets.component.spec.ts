import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersMarketsComponent } from './filters-markets.component';

describe('FiltersMarketsComponent', () => {
  let component: FiltersMarketsComponent;
  let fixture: ComponentFixture<FiltersMarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersMarketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
