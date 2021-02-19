import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersAssetsComponent } from './filters-assets.component';

describe('FiltersAssetsComponent', () => {
  let component: FiltersAssetsComponent;
  let fixture: ComponentFixture<FiltersAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
