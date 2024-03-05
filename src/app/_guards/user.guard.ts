import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../modules/products/product.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private productService: ProductService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.productService.getWithPopulatedFields({ isDeleted: false, active: true }, '').pipe(
      map((products) => {
        if (!products || products.length === 0) {
          this.router.navigate(['/404']);
          return false;
        } else {
          return true;
        }
      }),
    );
  }
}
