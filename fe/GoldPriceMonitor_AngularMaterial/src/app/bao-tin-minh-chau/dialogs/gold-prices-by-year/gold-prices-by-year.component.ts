import { Component, Inject, Optional } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { GoldType } from '../../../shared/gold-type';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatCommonModule } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MONTH_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-gold-prices-by-year',
  standalone: true,
  providers: [ 
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_MONTH_FORMATS),
  ], 
  imports: [ MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule ],
  templateUrl: './gold-prices-by-year.component.html',
  styleUrl: './gold-prices-by-year.component.scss'
})
export class GoldPricesByYearComponent {
  year = new FormControl(moment());
  goldTypes: GoldType[] = [];
  selectedGoldName: string = '';
  selectedGoldValue: string = '';
  goldKara: string = '';
  goldPurity: string = '';

  constructor(
    public dialogRef: MatDialogRef<GoldPricesByYearComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
  ) {
    this.goldTypes = mydata;
  }
  
  onGoldNameChanged(val: any) {
    var valStrs = val.split(' + ');
    this.selectedGoldName = valStrs[0];
    var goldType = this.goldTypes.find((value) => value.name == valStrs[0] && value.hamLuongKara == valStrs[1] && value.hamLuongVang == valStrs[2]);
    this.goldKara = goldType?.hamLuongKara === undefined ? '' : goldType.hamLuongKara;
    this.goldPurity = goldType?.hamLuongVang === undefined ? '' : goldType.hamLuongVang;
  }

  closeDialog() {
    var returned = { type: 'year', selectedGoldName: this.selectedGoldName, goldKara: this.goldKara, goldPurity: this.goldPurity, year: this.year.value };
    this.dialogRef.close({ event: 'close', data: returned });
  }

  setYear(normalizedMonthAndYear: Moment, dpy?: any) {
    const ctrlValue = this.year.value ?? moment();
    ctrlValue.year(normalizedMonthAndYear.year());
    this.year.setValue(ctrlValue);
    dpy.close();
  }
}
