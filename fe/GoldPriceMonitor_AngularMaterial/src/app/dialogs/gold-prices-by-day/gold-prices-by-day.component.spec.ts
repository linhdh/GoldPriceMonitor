import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldPricesByDayComponent } from './gold-prices-by-day.component';

describe('GoldPricesByDayComponent', () => {
  let component: GoldPricesByDayComponent;
  let fixture: ComponentFixture<GoldPricesByDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldPricesByDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoldPricesByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
