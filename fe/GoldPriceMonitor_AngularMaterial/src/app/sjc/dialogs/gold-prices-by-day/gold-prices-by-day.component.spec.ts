import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldPriceByDayComponent } from './gold-price-by-day.component';

describe('GoldPriceByDayComponent', () => {
  let component: GoldPriceByDayComponent;
  let fixture: ComponentFixture<GoldPriceByDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldPriceByDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoldPriceByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
