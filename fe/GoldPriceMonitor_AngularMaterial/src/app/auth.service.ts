import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignUpModel } from './shared/sign-up-model';
import { Observable, catchError, retry, throwError, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  registerUser(newSignUp: SignUpModel): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/identity/register', newSignUp).pipe(catchError(this.handleError.bind(this)));
  }

  // Error handling
  handleError(error: HttpErrorResponse) {
    //console.log(error);
    //let errorMessage = '';
    let errorMessages: string[] = [];
    if (error.status === 0) {
      //errorMessage = error.error;
      this.snackBar.open(error.error, 'Close');
      return of();
    } else {
      // Get server-side error
      this.snackBar.open(error.error.title, 'Close');
      Object.entries(error.error.errors).forEach(([key, value]: [any, any]) => {
        console.log(value[0]);
        errorMessages.push(value[0]);
      });
      return throwError(() => {
        return errorMessages;
      });
    }
  }
}
