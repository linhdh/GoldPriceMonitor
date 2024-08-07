import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { enUS } from 'date-fns/locale';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { SjcService } from '../sjc.service';
import { MatDialog } from '@angular/material/dialog';
import { GoldPricesByDayComponent } from './dialogs/gold-prices-by-day/gold-prices-by-day.component';
import { Sjc } from '../shared/sjc';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sjc',
  standalone: true,
  imports: [
    NgChartsModule, MatButtonModule
  ],
  templateUrl: './sjc.component.html',
  styleUrl: './sjc.component.scss'
})
export class SjcComponent {
  selectedGoldType_Day: string = '';
  city_Day: string = '';
  ngayXem_Day: Date = new Date();
  chartTitle: string = '';
  cities: string[] = [];

  constructor(private httpService: SjcService, public dialog: MatDialog) {
    //Chart.register(Annotation);
    this.httpService.getCities().subscribe((data: string[]) => {
      this.cities = data;
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

  openDayDialog() {
    const myTempDialog = this.dialog.open(GoldPricesByDayComponent, { data: { selectedGoldType: this.selectedGoldType_Day, city: this.city_Day, ngayXem: this.ngayXem_Day, cities: this.cities } });
    myTempDialog.afterClosed().subscribe((res) => {
      // Data back from dialog      
      if (res?.data?.type === 'day') {
        //set chart title
        this.chartTitle = 'Biểu đồ giá ' + res.data.selectedGoldType + ' của thành phố (tỉnh) ' + res.data.city + ' ngày ' + res.data.ngayXem.toLocaleDateString();
        this.selectedGoldType_Day = res.data.selectedGoldType;
        this.city_Day = res.data.city;
        this.ngayXem_Day = res.data.ngayXem;
        
        var giaMuaVaoData: number[] = [];
        var giaBanRaData: number[] = [];
        var timeData: Date[] = [];
        this.httpService.getDayPrices(res.data.selectedGoldType, res.data.city, res.data.ngayXem).subscribe((data: Sjc[]) => {
          data.forEach(element => {
            giaMuaVaoData.push(element.buyPrice);
            giaBanRaData.push(element.sellPrice);
            timeData.push(new Date(element.updatedTime));
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
    /*
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
    */
  }

  openOtherDialog() {
    throw new Error('Method not implemented.');
  }
   
  openYearDialog() {
    /*
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
    */
  }
}
