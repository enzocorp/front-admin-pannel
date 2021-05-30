import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsforSliderComponent } from './isfor-slider.component';

describe('IsforSliderComponent', () => {
  let component: IsforSliderComponent;
  let fixture: ComponentFixture<IsforSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsforSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsforSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
