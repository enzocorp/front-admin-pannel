import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnBanSymboleComponent } from './btn-ban-symbole.component';

describe('BtnBanFromMarketComponent', () => {
  let component: BtnBanSymboleComponent;
  let fixture: ComponentFixture<BtnBanSymboleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnBanSymboleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnBanSymboleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
