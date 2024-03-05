import { Injectable } from '@angular/core';

import { BehaviorSubject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Cart } from 'src/app/modules/cart/cart.model';
import { Product } from '../../modules/products/product.model';

import { TranslateService } from '@ngx-translate/core';
import { SNACKBARTYPE } from 'nextsapien-component-lib';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart: Cart = new Cart();

  private cartsObservable = new BehaviorSubject<any>({});
  private cartItemsObservable = new BehaviorSubject<any>({});
  private orderObservable = new BehaviorSubject<any>({});

  public cartTotalPrice = 0;

  public order;

  get carts() {
    return this.cartsObservable.asObservable();
  }

  get totalItems() {
    return this.cartItemsObservable.asObservable();
  }

  constructor(private sharedService: SharedService, private translateService: TranslateService) {
    this._cart.items.splice(0, 1);
    const localStorageCart = JSON.parse(localStorage.getItem('cart'));
    if (localStorageCart) {
      this._cart = localStorageCart;
    }
    this.getTotalPrice();
  }
  get Order() {
    return this.orderObservable.asObservable();
  }

  public fetchCarts() {
    return timer(10).pipe(
      tap(() => {
        this.cartsObservable.next(this._cart);
        this.getTotalPrice();
      }),
    );
  }

  public getCart() {
    return { ...this._cart };
  }

  public removeItem(index) {
    this._cart.items.splice(index, 1);
    this.getTotalPrice();
    this.translateService.get('SNACKBAR.PRODUCT_REMOVED_FROM_CART').subscribe((translation) => {
      this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
    });
  }

  public addToCart(product: Product, quantity = 1) {
    const cartItem = this._cart.items.find((p) => p.product.slug === product.slug);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      this._cart.items.push({
        product: product,
        quantity: quantity,
      });
    }
    this.getTotalPrice();
    this.translateService.get('SNACKBAR.PRODUCT_ADDED_TO_CART').subscribe((translation) => {
      this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
    });
  }

  public updateQuantity(index, quantity) {
    this._cart.items[index].quantity = quantity;
    this.getTotalPrice();
  }

  private getTotalPrice() {
    let price = 0;
    this._cart.items.forEach((item) => {
      price += item.quantity * item.product.currentPrice;
    });
    this._cart.total_price = price;
    this.cartsObservable.next(this._cart);
    this.cartItemsObservable.next(this._cart.items.length);
    localStorage.setItem('cart', JSON.stringify(this._cart));
  }

  public emptyCart() {
    this._cart.items = [];
    this.getTotalPrice();
  }

  public addToOrder(order: any) {
    this.order = order;
    this.orderObservable.next(order);
  }
  public emptyOrder() {
    this.order = null;
    this.orderObservable.next(null);
  }
}
