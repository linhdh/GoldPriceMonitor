import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignUpModel } from './shared/sign-up-model';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  registerUser(user: SignUpModel): Observable<void> {
    return this.http.get<void>(environment.apiUrl + '/api/identity/register').pipe(retry(1), catchError(this.handleError.bind(this)));
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
