import { Component, Inject, Optional } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { GoldType } from '../../shared/gold-type';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCommonModule } from '@angular/material/core';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MONTH_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-gold-prices-by-month',
  standalone: true,
  providers: [ 
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_MONTH_FORMATS),
  ], 
  imports: [ MatDialogModule, 
              MatFormFieldModule, 
              MatSelectModule, 
              MatDatepickerModule, 
              ReactiveFormsModule, 
              MatButtonModule, 
              MatInputModule, 
              MatCommonModule
            ],
  templateUrl: './gold-prices-by-month.component.html',
  styleUrl: './gold-prices-by-month.component.css'
})
export class GoldPricesByMonthComponent {
  month = new FormControl(moment());
  goldTypes: GoldType[] = [];
  selectedGoldName: string = '';
  goldKara: string = '';
  goldPurity: string = '';

  constructor(
    public dialogRef: MatDialogRef<GoldPricesByMonthComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
  ) {
    this.goldTypes = mydata;
  }

  closeDialog() { this.dialogRef.close({ event: 'close', data: 'month' }); }

  onGoldNameChanged(val: string) {
    var goldType = this.goldTypes.find((value) => value.name == val);
    this.goldKara = goldType?.hamLuongKara === undefined ? '' : goldType.hamLuongKara;
    this.goldPurity = goldType?.hamLuongVang === undefined ? '' : goldType.hamLuongVang;
  }
    
  setMonthAndYear(normalizedMonthAndYear: Moment, dpm?: any) {
    const ctrlValue = this.month.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.month.setValue(ctrlValue);
    dpm.close();
  }
}