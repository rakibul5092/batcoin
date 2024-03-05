import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SlideInOutAnimation } from 'nextsapien-component-lib';

import { MatStepper } from '@angular/material/stepper';
import { Cart } from 'src/app/modules/cart/cart.model';
import { Cms } from '../../modules/cms/cms.model';
import { SharedService } from '../../shared/shared.service';
import { CartService } from '../cart/cart.service';
import { AddressFormComponent } from './address-form/address-form.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  animations: [SlideInOutAnimation],
})
export class CheckoutPage implements OnInit, OnDestroy {
  @ViewChild('addressForm') address: AddressFormComponent;

  public shipment: any;
  public cart: Cart;
  public isLoading: boolean = false;
  private cartsSub: Subscription;

  public showFormControls: boolean = true;
  public cmsSettings: Cms;
  private cmsSub: Subscription;
  private stepper: MatStepper;

  constructor(private router: Router, private cartService: CartService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.cartsSub = this.cartService.carts.subscribe((cart) => {
      this.cart = cart;
      if (this.cartService.order) {
        this.goToCongratulations();
      } else {
        if (!(cart && cart.items && cart.items.length)) {
          this.router.navigate(['/cart']);
        }
      }
    });
    this.cmsSub = this.sharedService.cmsSettingsObs.subscribe((cmsSettings) => {
      this.cmsSettings = cmsSettings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.showFormControls = true;
    this.cartService.fetchCarts().subscribe(() => {
      this.isLoading = false;
    });
    if (this.stepper) {
      this.stepper.selectedIndex = 0;
    }
  }

  ngOnDestroy() {
    if (this.cartsSub) {
      this.cartsSub.unsubscribe();
    }
  }

  public onStepperInit(event: MatStepper) {
    this.stepper = event;
  }
  public onSuccess(shipment?): void {
    this.shipment = shipment;
    this.showFormControls = false;
  }

  public goToList() {
    this.router.navigate(['/list']);
  }
  private goToCongratulations() {
    this.cartsSub.unsubscribe();
    this.router.navigateByUrl('/checkout/congratulations');
  }
}
