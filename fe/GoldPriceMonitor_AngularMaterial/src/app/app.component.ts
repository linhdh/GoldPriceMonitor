import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, MatToolbarModule, MatButtonModule, RouterModule, RecaptchaV3Module ],
  providers: [
    ReCaptchaV3Service, 
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey}],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular Material - Gold Price Monitor';
}
