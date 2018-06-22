import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad{
  constructor(private authService: AuthService, private router: Router) { }

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

      if (this.authService.isLoggedIn) {
          return true;
      }

      this.authService.loginRedirectUrl = url;
      this.router.navigate(['/portal/login']);
      return false;
  }
}
