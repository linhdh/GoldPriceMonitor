import { Component, Inject, Optional } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SjcService } from '../../../sjc.service';

@Component({
  selector: 'app-gold-prices-by-day',
  standalone: true, 
  providers: [provideNativeDateAdapter(), 
  ], 
  imports: [ MatButtonModule, 
    MatDialogModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatDatepickerModule, 
    ReactiveFormsModule ],
  templateUrl: './gold-prices-by-day.component.html',
  styleUrl: './gold-prices-by-day.component.css'
})
export class GoldPricesByDayComponent {
  day = new FormControl(new Date());
  cities: string[] = [];
  goldTypes: string[] = [];
  selectedGoldType: string = '';
  selectedCity: string = '';

  constructor(
    public dialogRef: MatDialogRef<GoldPricesByDayComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any, 
    private httpService: SjcService
  ) {
    this.selectedGoldType = mydata.selectedGoldType;
    this.selectedCity = mydata.selectedCity;
    this.cities = mydata.cities;
    this.day.setValue(mydata.ngayXem);
  }

  onGoldNameChanged(val: string) {
    //var goldType = this.cities.find((value) => value == val);
    
  }

  onCityChanged(val: string) {
    //get list of gold types from server
    this.httpService.getTypes(val).subscribe((data) => {
      this.goldTypes = data;
    });
  }

  closeDialog() {
    var returned = { type: 'day', selectedGoldType: this.selectedGoldType, city: this.selectedCity, ngayXem: this.day.value };
    this.dialogRef.close({ event: 'close', data: returned }); 
  }
}
