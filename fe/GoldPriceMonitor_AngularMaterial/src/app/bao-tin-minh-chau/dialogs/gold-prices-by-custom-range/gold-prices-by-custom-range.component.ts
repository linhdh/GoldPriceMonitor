import { Component, Inject, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDateRangePicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GoldType } from '../../../shared/gold-type';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-gold-prices-by-custom-range',
  standalone: true,
  providers: [provideNativeDateAdapter(), 
  ],
  imports: [ MatDialogModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatButtonModule, MatInputModule ],
  templateUrl: './gold-prices-by-custom-range.component.html',
  styleUrl: './gold-prices-by-custom-range.component.scss'
})
export class GoldPricesByCustomRangeComponent {
  day = new FormControl(new Date());
  goldKara: string = '';
  goldPurity: string = '';
  goldTypes: GoldType[] = [];
  selectedGoldName: string = '';

  constructor(
    public dialogRef: MatDialogRef<GoldPricesByCustomRangeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
  )
  {

  }

  onGoldNameChanged(val: string) {
    var goldType = this.goldTypes.find((value) => value.name == val);
    this.goldKara = goldType?.hamLuongKara === undefined ? '' : goldType.hamLuongKara;
    this.goldPurity = goldType?.hamLuongVang === undefined ? '' : goldType.hamLuongVang;
  }

  closeDialog() {
    var returned = { type: 'day', selectedGoldName: this.selectedGoldName, goldKara: this.goldKara, goldPurity: this.goldPurity, ngayXem: this.day.value };
    this.dialogRef.close({ event: 'close', data: returned }); 
  }
}
