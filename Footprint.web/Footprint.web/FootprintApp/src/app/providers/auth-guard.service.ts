import { Injectable, NgZone } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { AuthService } from './auth.service';
import { UserModel } from '../models/userinfo';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
    user:UserModel;
    constructor(private authService: AuthService, private router: Router) { 
        this.user=authService.currentUser;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {

        let url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.user&& !this.authService.isSessionExpired) {
            return true;
        } else {
            this.authService.logout();
            this.authService.loginRedirectUrl = url;
            this.router.navigate(['/portal/login']);
            return false;
        }


    }
}
