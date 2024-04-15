import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { GoldType } from './shared/gold-type';
import { BaoTinMinhChau } from './shared/bao-tin-minh-chau';
import { DayPriceMinMax } from './shared/day-price-min-max';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaoTinMinhChauService {
  //apiURL = 'http://localhost:5044';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getGoldTypes(): Observable<GoldType[]> {
    return this.http.get<GoldType[]>(environment.apiUrl + '/api/BaoTinMinhChaus/GoldTypes').pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method
  getTodayPrices(goldType: GoldType): Observable<BaoTinMinhChau[]> {
    var params = new HttpParams();
    params = params.append('name', goldType.name);
    params = params.append('hamLuongKara', goldType.hamLuongKara);
    params = params.append('hamLuongVang', goldType.hamLuongVang);
    return this.http
      .get<BaoTinMinhChau[]>(environment.apiUrl + '/api/BaoTinMinhChaus/Today', {
        params: params, 
        observe: 'body'
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  getDayPrices(goldType: GoldType, day: Date): Observable<BaoTinMinhChau[]> {
    var params = new HttpParams();
    params = params.append('name', goldType.name);
    params = params.append('hamLuongKara', goldType.hamLuongKara);
    params = params.append('hamLuongVang', goldType.hamLuongVang);
    params = params.append('ngayXem', day.toLocaleString());
    return this.http
      .get<BaoTinMinhChau[]>(environment.apiUrl + '/api/BaoTinMinhChaus/Day', {
        params: params, 
        observe: 'body'
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  getMonthPrices(goldType: GoldType, day: Date): Observable<DayPriceMinMax[]> {
    var params = new HttpParams();
    params = params.append('name', goldType.name);
    params = params.append('hamLuongKara', goldType.hamLuongKara);
    params = params.append('hamLuongVang', goldType.hamLuongVang);
    params = params.append('thangXem', day.toLocaleString());
    return this.http
      .get<DayPriceMinMax[]>(environment.apiUrl + '/api/BaoTinMinhChaus/Month', {
        params: params, 
        observe: 'body'
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  getYearPrices(goldType: GoldType, day: Date): Observable<DayPriceMinMax[]> {
    var params = new HttpParams();
    params = params.append('name', goldType.name);
    params = params.append('hamLuongKara', goldType.hamLuongKara);
    params = params.append('hamLuongVang', goldType.hamLuongVang);
    params = params.append('namXem', day.toLocaleString());
    return this.http
      .get<DayPriceMinMax[]>(environment.apiUrl + '/api/BaoTinMinhChaus/Year', {
        params: params, 
        observe: 'body'
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
