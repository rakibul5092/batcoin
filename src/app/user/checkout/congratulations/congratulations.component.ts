import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Cart } from 'src/app/modules/cart/cart.model';
import { CartService } from '../../cart/cart.service';

import { take } from 'rxjs/operators';

import { CheckoutService } from '../checkout.service';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss'],
})
export class CongratulationsComponent implements OnInit, OnDestroy {
  public cart: Cart;
  public isLoading: boolean = false;

  private cartsSub: Subscription;
  public order;

  constructor(private router: Router, private checkoutService: CheckoutService, private cartService: CartService) {}

  ngOnInit() {
    this.cartsSub = this.cartService.Order.pipe(take(1)).subscribe((order) => {
      if (order === null) {
        this.router.navigate(['/cart']);
      }
      this.order = cloneDeep(order);
      this.cartService.emptyOrder();
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.cartService.fetchCarts().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    // this.cartService.order = null;
    if (this.cartsSub) {
      this.cartsSub.unsubscribe();
    }
  }

  public goToList() {
    this.router.navigate(['/list']);
  }

  downloadReceipt = (): void => this.checkoutService.downloadReceipt(this.order);
}
