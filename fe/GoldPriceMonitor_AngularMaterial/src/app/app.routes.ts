import { Routes } from '@angular/router';
import { BaoTinMinhChauComponent } from './bao-tin-minh-chau/bao-tin-minh-chau.component';
import { SjcComponent } from './sjc/sjc.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'bao-tin-minh-chau', 
        pathMatch: 'full' 
    },
    {
        path: 'bao-tin-minh-chau', 
        component: BaoTinMinhChauComponent, 
        title: 'Bảo tín minh châu'
    }, 
    {
        path: 'sjc', 
        component: SjcComponent, 
        title: 'Bảo tín minh châu'
    },
    {
        path: 'login', 
        component: LoginComponent, 
        title: 'Đăng nhập'
    }
];
