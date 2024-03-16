import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldPricesByYearComponent } from './gold-prices-by-year.component';

describe('GoldPricesByYearComponent', () => {
  let component: GoldPricesByYearComponent;
  let fixture: ComponentFixture<GoldPricesByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldPricesByYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoldPricesByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
