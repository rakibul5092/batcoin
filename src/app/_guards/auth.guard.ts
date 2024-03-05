import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from 'nextsapien-component-lib';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('id_token');
    const isCompleteLogin = localStorage.getItem('require_otp') ? localStorage.getItem('mfa') : true;
    if (token && isCompleteLogin) {
      return this.authService.JWTHasExpired(token).pipe(
        map(
          (data: any) => {
            if (data.success) {
              return true;
            }

            this.authService.logout();

            this.router.navigate(['/auth', 'login']);
            return false;
          },
          (error) => {},
        ),
      );
    } else {
      this.router.navigate(['/auth', 'login']);
      this.authService.logout(false);
      return false;
    }
  }
}
