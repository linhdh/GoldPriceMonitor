import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-gold-prices-by-custom-range',
  standalone: true,
  providers: [provideNativeDateAdapter(), 
  ], 
  imports: [ MatDialogModule, MatButtonModule, MatFormFieldModule ],
  templateUrl: './gold-prices-by-custom-range.component.html',
  styleUrl: './gold-prices-by-custom-range.component.scss'
})
export class GoldPricesByCustomRangeComponent {

}
