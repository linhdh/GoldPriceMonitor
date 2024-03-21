import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Sjc } from './shared/sjc';

@Injectable({
  providedIn: 'root'
})
export class SjcService {
  apiURL: string = 'http://localhost:5044';

  constructor(private http: HttpClient) { }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(this.apiURL + '/api/Sjcs/Cities').pipe(retry(1), catchError(this.handleError));
  }

  getTypes(city: string): Observable<string[]> {
    var params = new HttpParams();
    params = params.append('city', city);
    return this.http.get<string[]>(this.apiURL + '/api/Sjcs/Types', {
      params: params, 
      observe: 'body'
    }).pipe(retry(1), catchError(this.handleError));
  }

  getDayPrices(goldType: string, city: string, day: Date): Observable<Sjc[]> {
    var params = new HttpParams();
    params = params.append('type', goldType);
    params = params.append('city', city);
    params = params.append('ngayXem', day.toLocaleString());
    return this.http
      .get<Sjc[]>(this.apiURL + '/api/Sjcs/Day', {
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
