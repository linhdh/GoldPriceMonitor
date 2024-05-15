import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoTinMinhChau2Component } from './bao-tin-minh-chau2.component';

describe('BaoTinMinhChau2Component', () => {
  let component: BaoTinMinhChau2Component;
  let fixture: ComponentFixture<BaoTinMinhChau2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaoTinMinhChau2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaoTinMinhChau2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
