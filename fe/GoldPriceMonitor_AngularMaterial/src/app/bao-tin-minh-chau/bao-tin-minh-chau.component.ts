import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NgChartsModule } from 'ng2-charts';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BaoTinMinhChauService } from '../bao-tin-minh-chau.service';
import { GoldType } from '../shared/gold-type';
import { BaoTinMinhChau } from '../shared/bao-tin-minh-chau';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DayPriceMinMax } from '../shared/day-price-min-max';
import { GoldPricesByMonthComponent } from './dialogs/gold-prices-by-month/gold-prices-by-month.component';
import { GoldPricesByYearComponent } from './dialogs/gold-prices-by-year/gold-prices-by-year.component';
import { GoldPricesByDayComponent } from './dialogs/gold-prices-by-day/gold-prices-by-day.component';
import { GoldPricesByCustomRangeComponent } from './dialogs/gold-prices-by-custom-range/gold-prices-by-custom-range.component';


@Component({
  selector: 'app-bao-tin-minh-chau',
  standalone: true,
  imports: [ NgChartsModule, 
              MatButtonModule, 
              MatButtonToggleModule, 
              CommonModule, 
              MatDialogModule, 
              MatFormFieldModule, 
              MatDatepickerModule, 
              MatInputModule, 
              ReactiveFormsModule, 
              MatSelectModule, 
              MatTooltipModule,
              MatProgressSpinnerModule,
              MatProgressBarModule ],
  templateUrl: './bao-tin-minh-chau.component.html',
  styleUrl: './bao-tin-minh-chau.component.css'
})
export class BaoTinMinhChauComponent {
  selectedGoldName_Day: string = '';
  goldKara_Day: string = '';
  goldPurity_Day: string = '';
  ngayXem_Day: Date = new Date();
  chartTitle: string = '';
  goldTypes: GoldType[] = [];
  showProgressBarCount: number = 0;

  constructor(private httpService: BaoTinMinhChauService, public dialog: MatDialog) {
    //Chart.register(Annotation);
    this.showProgressBarCount++;
    this.httpService.getGoldTypes().subscribe((data: GoldType[]) => {
      this.goldTypes = data;
      this.showProgressBarCount--;
    }, error => {
      this.showProgressBarCount--;
    });
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
    ]
  };

  public lineChartOptions: ChartOptions = {
    scales: {
      x: {
          type: 'time',
          time: {
            unit: 'day'
          }, 
          adapters: { 
            date: {
              locale: enUS, 
            },
          },
        },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }

  /*
  public changeInDrawingPeriod(val: string) {
    if (val === "today") {
      console.log(val);
      var goldType = new GoldType();
      goldType.name = 'VÀNG MIẾNG SJC (Vàng SJC)';
      goldType.hamLuongKara = '24k';
      goldType.hamLuongVang = '999.9';
      var giaMuaVaoData: number[] = [];
      var giaBanRaData: number[] = [];
      var timeData: Date[] = [];
      this.httpService.getTodayPrices(goldType).subscribe((data: BaoTinMinhChau[]) => {
        console.log(data);
        data.forEach(element => {
          giaMuaVaoData.push(element.giaMuaVao);
          giaBanRaData.push(element.giaBanRa);
          timeData.push(new Date(element.thoiGianNhap));
        });
        this.lineChartData = {
          datasets: [
            {
              data: giaMuaVaoData,
              label: 'Giá mua vào',
              backgroundColor: 'rgba(148, 159, 177, 0.2)',
              borderColor: 'rgba(148, 159, 177, 1)',
              pointBackgroundColor: 'rgba(148, 159, 177, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148, 159, 177, 0.8)',
            }, 
            {
              data: giaBanRaData,
              label: 'Giá bán ra',
              backgroundColor: 'rgba(148, 59, 50, 0.2)',
              borderColor: 'rgba(148, 59, 50, 1)',
              pointBackgroundColor: 'rgba(148, 59, 50, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148, 59, 50, 0.8)',
            }
          ],
          labels: timeData,
        };
      });
    }
    else if (val == 'day')
    {
      this.openDayDialog();
    }
  }
  */

  openDayDialog() {
    const myTempDialog = this.dialog.open(GoldPricesByDayComponent, { data: { goldTypes: this.goldTypes, selectedGoldName: this.selectedGoldName_Day, goldKara: this.goldKara_Day, goldPurity: this.goldPurity_Day, ngayXem: this.ngayXem_Day } });
    myTempDialog.afterClosed().subscribe((res) => {
      // Data back from dialog      
      if (res?.data?.type === 'day') {
        //set chart title
        this.chartTitle = 'Biểu đồ giá ' + res.data.selectedGoldName + ', ' + res.data.goldKara + ', ' + res.data.goldPurity + ' ngày ' + res.data.ngayXem.toLocaleDateString();
        this.selectedGoldName_Day = res.data.selectedGoldName;
        this.goldKara_Day = res.data.goldKara;
        this.goldPurity_Day = res.data.goldPurity;
        this.ngayXem_Day = res.data.ngayXem;
        
        var goldType = new GoldType();        
        goldType.name = this.selectedGoldName_Day;
        goldType.hamLuongKara = res.data.goldKara;
        goldType.hamLuongVang = res.data.goldPurity;
        var giaMuaVaoData: number[] = [];
        var giaBanRaData: number[] = [];
        var timeData: Date[] = [];
        this.httpService.getDayPrices(goldType, res.data.ngayXem).subscribe((data: BaoTinMinhChau[]) => {
          data.forEach(element => {
            giaMuaVaoData.push(element.giaMuaVao);
            giaBanRaData.push(element.giaBanRa);
            timeData.push(new Date(element.thoiGianNhap));
          });
          this.lineChartData = {
            datasets: [
              {
                data: giaMuaVaoData,
                label: 'Giá mua vào',
                backgroundColor: 'rgba(148, 159, 177, 0.2)',
                borderColor: 'rgba(148, 159, 177, 1)',
                pointBackgroundColor: 'rgba(148, 159, 177, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 159, 177, 0.8)',
              }, 
              {
                data: giaBanRaData,
                label: 'Giá bán ra',
                backgroundColor: 'rgba(148, 59, 50, 0.2)',
                borderColor: 'rgba(148, 59, 50, 1)',
                pointBackgroundColor: 'rgba(148, 59, 50, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 59, 50, 0.8)',
              }
            ],
            labels: timeData,
          };

          this.lineChartOptions = {
            scales: {
              x: {
                  type: 'time',
                  time: {
                    unit: 'hour'
                  }, 
                  adapters: { 
                    date: {
                      locale: enUS, 
                    },
                  },
                },
            },
          };

          this.lineChartType = 'line';
        });
      }
    });
  }

  openMonthDialog() {
    const myTempDialog2 = this.dialog.open(GoldPricesByMonthComponent, { data: this.goldTypes });
    myTempDialog2.afterClosed().subscribe((res) => {
      if (res?.data?.type === 'month') {
        var localDate = res.data.month?.toDate();
        //TODO: if localDate is undefined or null, show some thing for this error.
        
        //set chart title
        this.chartTitle = 'Biểu đồ giá ' + res.data.selectedGoldName + ', ' + res.data.goldKara + ', ' + res.data.goldPurity + ' tháng ' + (localDate.getMonth() + 1) + '/' + localDate.getFullYear();
        var goldType = new GoldType();
        goldType.name = res.data.selectedGoldName;
        goldType.hamLuongKara = res.data.goldKara;
        goldType.hamLuongVang = res.data.goldPurity;
        var giaMuaVaoMinData: number[] = [];
        var giaBanRaMinData: number[] = [];
        var giaMuaVaoMaxData: number[] = [];
        var giaBanRaMaxData: number[] = [];
        var timeData: Date[] = [];
        this.httpService.getMonthPrices(goldType, localDate).subscribe((data: DayPriceMinMax[]) => {
          data.forEach(element => {
            giaMuaVaoMinData.push(element.giaMuaVaoMin);
            giaBanRaMinData.push(element.giaBanRaMin);
            giaMuaVaoMaxData.push(element.giaMuaVaoMax);
            giaBanRaMaxData.push(element.giaBanRaMax);
            timeData.push(new Date(element.thoiGianNhap));
          });
          this.lineChartData = {
            datasets: [
              {
                data: giaMuaVaoMinData,
                label: 'Giá mua vào nhỏ nhất',
                backgroundColor: 'rgba(148, 159, 177, 0.2)',
                borderColor: 'rgba(148, 159, 177, 1)',
                pointBackgroundColor: 'rgba(148, 159, 177, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 159, 177, 0.8)',
              }, 
              {
                data: giaMuaVaoMaxData,
                label: 'Giá mua vào lớn nhất',
                backgroundColor: 'rgba(148, 159, 77, 0.2)',
                borderColor: 'rgba(148, 159, 77, 1)',
                pointBackgroundColor: 'rgba(148, 159, 77, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 159, 77, 0.8)',
              }, 
              {
                data: giaBanRaMinData,
                label: 'Giá bán ra nhỏ nhất',
                backgroundColor: 'rgba(148, 59, 50, 0.2)',
                borderColor: 'rgba(148, 59, 50, 1)',
                pointBackgroundColor: 'rgba(148, 59, 50, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 59, 50, 0.8)',
              }, 
              {
                data: giaBanRaMaxData,
                label: 'Giá bán ra lớn nhất',
                backgroundColor: 'rgba(148, 59, 5, 0.2)',
                borderColor: 'rgba(148, 59, 5, 1)',
                pointBackgroundColor: 'rgba(148, 59, 5, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 59, 5, 0.8)',
              }
            ],
            labels: timeData,
          };

          this.lineChartOptions = {
            scales: {
              x: {
                  type: 'time',
                  time: {
                    unit: 'day'
                  }, 
                  adapters: { 
                    date: {
                      locale: enUS, 
                    },
                  },
                },
            },
          };

          this.lineChartType = 'line';
        });
      }
    });
  }

  openOtherDialog() {
    const myTempDialog = this.dialog.open(GoldPricesByCustomRangeComponent, { });
  }
   
  openYearDialog() {
    const myTempDialog2 = this.dialog.open(GoldPricesByYearComponent, { data: this.goldTypes });
    myTempDialog2.afterClosed().subscribe((res) => {
      if (res?.data?.type === 'year') {
        var localDate = res.data.year?.toDate();
        console.log(localDate);
        //TODO: if localDate is undefined or null, show some thing for this error.
        
        //set chart title
        this.chartTitle = 'Biểu đồ giá ' + res.data.selectedGoldName + ', ' + res.data.goldKara + ', ' + res.data.goldPurity + ' năm ' + localDate.getFullYear();
        var goldType = new GoldType();
        goldType.name = res.data.selectedGoldName;
        goldType.hamLuongKara = res.data.goldKara;
        goldType.hamLuongVang = res.data.goldPurity;
        var giaMuaVaoMinData: number[] = [];
        var giaBanRaMinData: number[] = [];
        var giaMuaVaoMaxData: number[] = [];
        var giaBanRaMaxData: number[] = [];
        var timeData: Date[] = [];
        this.httpService.getYearPrices(goldType, localDate).subscribe((data: DayPriceMinMax[]) => {
          data.forEach(element => {
            giaMuaVaoMinData.push(element.giaMuaVaoMin);
            giaBanRaMinData.push(element.giaBanRaMin);
            giaMuaVaoMaxData.push(element.giaMuaVaoMax);
            giaBanRaMaxData.push(element.giaBanRaMax);
            timeData.push(new Date(element.thoiGianNhap));
          });
          this.lineChartData = {
            datasets: [
              {
                data: giaMuaVaoMinData,
                label: 'Giá mua vào nhỏ nhất',
                backgroundColor: 'rgba(148, 159, 177, 0.2)',
                borderColor: 'rgba(148, 159, 177, 1)',
                pointBackgroundColor: 'rgba(148, 159, 177, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 159, 177, 0.8)',
              }, 
              {
                data: giaMuaVaoMaxData,
                label: 'Giá mua vào lớn nhất',
                backgroundColor: 'rgba(148, 159, 77, 0.2)',
                borderColor: 'rgba(148, 159, 77, 1)',
                pointBackgroundColor: 'rgba(148, 159, 77, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 159, 77, 0.8)',
              }, 
              {
                data: giaBanRaMinData,
                label: 'Giá bán ra nhỏ nhất',
                backgroundColor: 'rgba(148, 59, 50, 0.2)',
                borderColor: 'rgba(148, 59, 50, 1)',
                pointBackgroundColor: 'rgba(148, 59, 50, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 59, 50, 0.8)',
              }, 
              {
                data: giaBanRaMaxData,
                label: 'Giá bán ra lớn nhất',
                backgroundColor: 'rgba(148, 59, 5, 0.2)',
                borderColor: 'rgba(148, 59, 5, 1)',
                pointBackgroundColor: 'rgba(148, 59, 5, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148, 59, 5, 0.8)',
              }
            ],
            labels: timeData,
          };

          this.lineChartOptions = {
            scales: {
              x: {
                  type: 'time',
                  time: {
                    unit: 'day'
                  }, 
                  adapters: { 
                    date: {
                      locale: enUS, 
                    },
                  },
                },
            },
          };

          this.lineChartType = 'line';
        });
      }
    });
  }
}
