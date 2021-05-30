import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsComponent } from './markets.component';

describe('MarketsComponent', () => {
  let component: MarketsComponent;
  let fixture: ComponentFixture<MarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
