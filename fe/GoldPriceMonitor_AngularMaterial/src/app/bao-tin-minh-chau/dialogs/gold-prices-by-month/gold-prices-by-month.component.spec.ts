import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldPricesByMonthComponent } from './gold-prices-by-month.component';

describe('GoldPricesByMonthComponent', () => {
  let component: GoldPricesByMonthComponent;
  let fixture: ComponentFixture<GoldPricesByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldPricesByMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoldPricesByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
