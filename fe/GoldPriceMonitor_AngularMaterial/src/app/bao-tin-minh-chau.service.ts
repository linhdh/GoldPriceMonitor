import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { GoldType } from './shared/gold-type';
import { BaoTinMinhChau } from './shared/bao-tin-minh-chau';

@Injectable({
  providedIn: 'root'
})
export class BaoTinMinhChauService {
  apiURL = 'http://localhost:5044';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getGoldTypes(): Observable<GoldType[]> {
    return this.http.get<GoldType[]>(this.apiURL + '/api/BaoTinMinhChaus/GoldTypes').pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method
  getTodayPrices(goldType: GoldType): Observable<BaoTinMinhChau[]> {
    var params = new HttpParams();
    params = params.append('name', goldType.name);
    params = params.append('hamLuongKara', goldType.hamLuongKara);
    params = params.append('hamLuongVang', goldType.hamLuongVang);
    return this.http
      .get<BaoTinMinhChau[]>(this.apiURL + '/api/BaoTinMinhChaus/Today', {
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
      .get<BaoTinMinhChau[]>(this.apiURL + '/api/BaoTinMinhChaus/Day', {
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
