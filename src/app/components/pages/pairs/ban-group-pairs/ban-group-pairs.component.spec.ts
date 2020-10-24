import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanGroupPairsComponent } from './ban-group-pairs.component';

describe('BanGroupPairsComponent', () => {
  let component: BanGroupPairsComponent;
  let fixture: ComponentFixture<BanGroupPairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanGroupPairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanGroupPairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
