import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnBanMarketComponent } from './btn-ban-market.component';

describe('BtnBanMarketComponent', () => {
  let component: BtnBanMarketComponent;
  let fixture: ComponentFixture<BtnBanMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnBanMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnBanMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
