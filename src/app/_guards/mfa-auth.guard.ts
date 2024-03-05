import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'nextsapien-component-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MfaAuthGuard implements CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url !== '/auth/2fa') return true;
    const stateObject = this.router.getCurrentNavigation().extras.state;
    if (!stateObject || !stateObject['auth']) return this.invalid();

    return true;
  }

  private invalid() {
    this.router.navigate(['/auth', 'login']);
    return false;
  }
}
