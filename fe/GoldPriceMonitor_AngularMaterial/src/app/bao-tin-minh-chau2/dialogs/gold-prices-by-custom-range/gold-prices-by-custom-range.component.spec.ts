import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldPricesByCustomRangeComponent } from './gold-prices-by-custom-range.component';

describe('GoldPricesByCustomRangeComponent', () => {
  let component: GoldPricesByCustomRangeComponent;
  let fixture: ComponentFixture<GoldPricesByCustomRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldPricesByCustomRangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoldPricesByCustomRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
