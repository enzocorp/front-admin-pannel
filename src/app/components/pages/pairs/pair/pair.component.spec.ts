import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairComponent } from './pair.component';

describe('ModalComponent', () => {
  let component: PairComponent;
  let fixture: ComponentFixture<PairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
