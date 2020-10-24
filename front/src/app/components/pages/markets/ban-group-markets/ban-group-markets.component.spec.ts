import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanGroupMarketsComponent } from './ban-group-markets.component';

describe('BanGroupMarketsComponent', () => {
  let component: BanGroupMarketsComponent;
  let fixture: ComponentFixture<BanGroupMarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanGroupMarketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanGroupMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
