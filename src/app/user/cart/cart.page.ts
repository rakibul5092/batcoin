import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart } from 'src/app/modules/cart/cart.model';
import { Cms } from '../../modules/cms/cms.model';
import { SharedService } from '../../shared/shared.service';
import { CartService } from './cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  public cart: Cart;
  public isLoading = false;
  private cartsSub: Subscription;
  private cmsSub: Subscription;

  public displayedColumns: string[] = ['productImage', 'productName', 'price', 'quantity', 'subtotal', 'actions'];
  public dataSource;

  public cmsSettings: Cms;
  constructor(private cartService: CartService, private router: Router, private sharedService: SharedService, private snackbar: MatSnackBar) {}

  ngOnInit() {
    this.cartsSub = this.cartService.carts.subscribe((cart) => {
      this.cart = cart;
      this.dataSource = new MatTableDataSource(this.cart.items);
    });

    this.cmsSub = this.sharedService.cmsSettingsObs.subscribe((cmsSettings) => {
      this.cmsSettings = cmsSettings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.cartService.fetchCarts().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.cartsSub?.unsubscribe();
    this.cmsSub?.unsubscribe();
  }

  public goToList = () => this.router.navigate(['/list']);

  public goToCheckout = () => {
    this.cart.items.forEach((val) => {
      if (val.quantity < 1 || !val.quantity) {
        val.quantity = 1;
      }
    });
    this.router.navigate(['/checkout']);
  };

  public removeItem = (index): void => this.cartService.removeItem(index);

  public valueChanged = (index: number, quantity: any) => {
    let qty = quantity.value;
    if (qty == 0) {
      qty = 1;
    } else if (qty > 9999) {
      qty = 9999;
    }
    this.cartService.updateQuantity(index, qty);
  };

  public emptyCart(): void {
    this.cartService.emptyCart();
  }
}
