import { Routes } from '@angular/router';
import { BaoTinMinhChauComponent } from './bao-tin-minh-chau/bao-tin-minh-chau.component';
import { SjcComponent } from './sjc/sjc.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    {
        path: '', 
        component: AuthComponent, 
        children: [
            {
                path: 'login', 
                component: LoginComponent, 
                title: 'Đăng nhập'
            },
            {
                path: 'sign-up', 
                component: SignUpComponent, 
                title: 'Tạo tài khoản mới'
            }, 
            {
                path: 'forgot-password', 
                component: ForgotPasswordComponent, 
                title: 'Quên mật khẩu'
            }
        ]
    },
    {
        path: '',
        component: AdminComponent, 
        children: [
            {
                path: 'bao-tin-minh-chau', 
                component: BaoTinMinhChauComponent, 
                title: 'Bảo tín minh châu'
            }, 
            {
                path: 'sjc', 
                component: SjcComponent, 
                title: 'Bảo tín minh châu'
            }
        ]
    }
];
