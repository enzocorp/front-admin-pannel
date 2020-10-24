import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBanMarketComponent } from './form-ban-market.component';

describe('FormBanMarketComponent', () => {
  let component: FormBanMarketComponent;
  let fixture: ComponentFixture<FormBanMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBanMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBanMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
