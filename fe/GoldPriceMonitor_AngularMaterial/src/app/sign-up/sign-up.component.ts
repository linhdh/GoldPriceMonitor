import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { repasswordIsMatchedValidator } from './repassword-is-matched.cross-validation';
import { SignUpModel } from '../shared/sign-up-model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signupForm: FormGroup = new FormGroup({
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    passwordControl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    repasswordControl: new FormControl('', [Validators.required]),
  }, { validators: repasswordIsMatchedValidator });
  serverErrors: string[] = [];

  get emailControl() {
    return this.signupForm.get('emailControl');
  }

  get passwordControl() {
    return this.signupForm.get('passwordControl');
  }

  get repasswordControl() {
    return this.signupForm.get('repasswordControl');
  }

  constructor(private authService: AuthService, private recaptchaV3Service: ReCaptchaV3Service, private snackBar: MatSnackBar) {

  }

  onSubmit() {
    //  TODO: Use EventEmitter with form value
    if (this.signupForm.invalid) {
      //console.warn(this.signupForm);
      //console.log(this.signupForm!.hasError('repasswordIsMatched'));
      this.signupForm.markAllAsTouched();
      this.signupForm.markAsDirty();
      return;
    }

    this.recaptchaV3Service.execute('signup').subscribe((token: string) => {
      //console.warn(`Token [${token}] generated`);
    });

    var newSignUp: SignUpModel = {
      email: this.emailControl?.value, 
      password: this.passwordControl?.value
    };
    this.authService.registerUser(newSignUp).subscribe(data => {
      console.log(data);
      this.serverErrors = [];
      this.snackBar.open("User is created.", 'Close');
      
    }, error => {
      console.warn(error);
      this.serverErrors = error;
    });
  }
}
