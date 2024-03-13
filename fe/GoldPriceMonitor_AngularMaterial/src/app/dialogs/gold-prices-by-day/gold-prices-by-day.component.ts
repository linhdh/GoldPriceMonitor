import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GoldType } from '../../shared/gold-type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gold-prices-by-day',
  standalone: true,
  providers: [provideNativeDateAdapter(), 
  ], 
  imports: [ MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule ],
  templateUrl: './gold-prices-by-day.component.html',
  styleUrl: './gold-prices-by-day.component.css'
})
export class GoldPricesByDayComponent implements OnInit {
  day = new FormControl(new Date());
  goldKara: string = '';
  goldPurity: string = '';
  goldTypes: GoldType[] = [];
  selectedGoldName: string = '';

  constructor(
    public dialogRef: MatDialogRef<GoldPricesByDayComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
  ) {
    this.goldTypes = mydata.goldTypes;
    this.selectedGoldName = mydata.selectedGoldName;
    this.goldKara = mydata.goldKara;
    this.goldPurity = mydata.goldPurity;
    this.day.setValue(mydata.ngayXem);
  }

  ngOnInit(): void {
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
