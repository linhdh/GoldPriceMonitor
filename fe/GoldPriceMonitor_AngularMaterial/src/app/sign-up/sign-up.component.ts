import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signupForm = new FormGroup({
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    passwordControl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    repasswordControl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  });

  get emailControl() {
    return this.signupForm.get('emailControl');
  }

  get passwordControl() {
    return this.signupForm.get('passwordControl');
  }

  get repasswordControl() {
    return this.signupForm.get('repasswordControl');
  }

  constructor(private authService: AuthService, private recaptchaV3Service: ReCaptchaV3Service) {

  }

  onSubmit() {
    //  TODO: Use EventEmitter with form value
    console.warn(this.signupForm.value);
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.recaptchaV3Service.execute('signup').subscribe((token: string) => {
      console.warn(`Token [${token}] generated`);
    });
  }
}
