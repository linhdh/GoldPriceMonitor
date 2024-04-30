import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Sjc } from './shared/sjc';
import { environment } from '../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { duration } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SjcService {
  apiURL: string = 'http://localhost:5044';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(environment.apiUrl + '/api/Sjcs/Cities').pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  getTypes(city: string): Observable<string[]> {
    var params = new HttpParams();
    params = params.append('city', city);
    return this.http.get<string[]>(environment.apiUrl + '/api/Sjcs/Types', {
      params: params, 
      observe: 'body'
    }).pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  getDayPrices(goldType: string, city: string, day: Date): Observable<Sjc[]> {
    var params = new HttpParams();
    params = params.append('type', goldType);
    params = params.append('city', city);
    params = params.append('ngayXem', day.toLocaleString());
    return this.http
      .get<Sjc[]>(environment.apiUrl + '/api/Sjcs/Day', {
        params: params, 
        observe: 'body'
      })
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = error.message;
    }
    this.snackBar.open(errorMessage, 'Close');
    return throwError(() => {
      return errorMessage;
    });
  }
}
