import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-bao-tin-minh-chau',
  standalone: true,
  imports: [ NgChartsModule, MatButtonModule, MatButtonToggleModule, CommonModule ],
  templateUrl: './bao-tin-minh-chau.component.html',
  styleUrl: './bao-tin-minh-chau.component.css'
})
export class BaoTinMinhChauComponent {
  private newLabel? = 'New label';

  constructor(private httpService: BaoTinMinhChauService) {
    //Chart.register(Annotation);
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
    ]
  };

  public lineChartOptions: ChartOptions = {
    scales: {
      x: {
          type: 'time',
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
  }
}
