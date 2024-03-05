import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';

import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, finalize, map, takeUntil } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';
import { StripeCardComponent, StripeService } from 'ngx-stripe';

import { StripeCardElementOptions, StripeElementLocale, StripeElementsOptions } from '@stripe/stripe-js';
import { AddressFormService, SharedService as SharedServiceLib, SNACKBARTYPE } from 'nextsapien-component-lib';

import { TranslateService } from '@ngx-translate/core';
import { Cart } from 'src/app/modules/cart/cart.model';
import { OrderService } from 'src/app/modules/orders/order.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SHIPPING_APIS, SHIPPING_CARRIERS } from '../../../app.lookup';
import { Cms } from '../../../modules/cms/cms.model';
import { HttpUtilService } from '../../../services/http-utils.service';
import { CartService } from '../../cart/cart.service';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class AddressFormComponent implements OnInit, OnDestroy, AfterViewInit {
  private formValue;
  public shipmentLoading;
  public selectedRate;
  public shipment: any;
  public carriers: any[] = SHIPPING_CARRIERS;
  private googleAddressState;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @ViewChild('stepper') stepper: MatStepper;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() stepperEmitter = new EventEmitter<MatStepper>();

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const elementExists = document.getElementsByClassName('country-search').length;
    if (elementExists) {
      const element = this.renderer?.selectRootElement('.country-search');
      const x = element as HTMLElement;
      setTimeout(() => x.focus(), 200);
    }
  }

  public countriesList = [];
  public statesList = [];
  public cart: Cart;
  public submitted: boolean = false;
  public notFoundText = 'Select a Country first';
  private _unsubscribeAll: Subject<any>;
  public firstFormGroup = this.checkoutService.personalInfoFormGroup();
  public secondFormGroup = this.checkoutService.addressInfoFormGroup();
  public thirdFormGroup = this.checkoutService.contactInfoFormGroup();
  public stepperOrientation: Observable<StepperOrientation>;
  public stripeFormError = '';
  public cardOptions: StripeCardElementOptions = this.checkoutService.buildCardOptions();
  public elementsOptions: StripeElementsOptions = { locale: 'en' };
  private cmsSub: Subscription;
  public cmsSettings: Cms;
  public selectedCounty: any;
  public selectedState: any;
  public shippingRatesError: string;
  public createdOrder: any;
  public loadingStates: boolean;
  public separateDialCode = false;
  public preferredCountries: string[] = ['us', 'uk'];
  public isStripeFormCompleted: boolean = false;
  public isOrderPlaced: boolean = false;
  constructor(
    private stripeService: StripeService,
    private sharedService: SharedService,
    private orderService: OrderService,
    private cartService: CartService,
    private breakpointObserver: BreakpointObserver,
    private sharedServiceLib: SharedServiceLib,
    private translateService: TranslateService,
    private httpUtilService: HttpUtilService,
    private checkoutService: CheckoutService,
    private addressFormService: AddressFormService,
    private renderer: Renderer2,
  ) {
    this._unsubscribeAll = new Subject();
    this.elementsOptions = {
      locale: this.translateService.currentLang as StripeElementLocale,
    };
  }
  ngAfterViewInit(): void {
    this.stepperEmitter.emit(this.stepper);
  }

  ngOnInit() {
    this.stepperOrientation = this.breakpointObserver.observe('(min-width: 800px)').pipe(
      takeUntil(this._unsubscribeAll),
      map(({ matches }) => (matches ? 'horizontal' : 'vertical')),
    );
    this.addressFormService.countries.pipe(takeUntil(this._unsubscribeAll)).subscribe((countries) => {
      this.countriesList = countries;
      this.selectedCounty = this.countriesList.find((country) => country.country_name === this.secondFormGroup.controls['country'].value);
    });

    this.secondFormGroup
      .get('country')
      .valueChanges.pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged())
      .subscribe((result) => {
        this.countryChange(result);
      });

    this.cartService.carts.pipe(takeUntil(this._unsubscribeAll)).subscribe((cart) => {
      this.cart = cart;
    });
    this.translateService.onLangChange.subscribe((lang) => {
      // Change stripe locale to current language
      this.elementsOptions = {
        locale: lang.lang as StripeElementLocale,
      };
    });

    this.cmsSub = this.sharedService.cmsSettingsObs.subscribe((cmsSettings) => {
      this.cmsSettings = cmsSettings;
    });

    const checkoutFormValue = JSON.parse(localStorage.getItem('checkoutFormValue'));

    this.firstFormGroup.patchValue(checkoutFormValue);
    this.secondFormGroup.patchValue(checkoutFormValue);
    this.thirdFormGroup.patchValue(checkoutFormValue);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    if (this.cmsSub) {
      this.cmsSub.unsubscribe();
    }
  }

  public onSubmit(form: UntypedFormGroup) {
    let checkoutFormValue = JSON.parse(localStorage.getItem('checkoutFormValue'));

    const formValues = form.value;
    checkoutFormValue = {
      ...checkoutFormValue,
      ...formValues,
    };

    localStorage.setItem('checkoutFormValue', JSON.stringify(checkoutFormValue));

    Object.keys(form.controls).forEach((key) => {
      form.controls[key].markAsTouched();
    });
  }

  public countryChange(value) {
    this.secondFormGroup.get('country').patchValue(value, { emitEvent: false });
    if (value) {
      this.loadingStates = true;
      this.addressFormService
        .fetchStates(value)
        .pipe(
          finalize(() => {
            this.loadingStates = false;
          }),
        )
        .subscribe((states) => {
          this.notFoundText = 'No states found';
          this.statesList = states;
          if (this.googleAddressState) {
            this.handleGoogleAddressState();
          } else {
            this.resetControl('state');
          }
        });
    }
  }

  private resetMultiStepForm() {
    this.stepper.reset();
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
  }

  public createToken(stepper: MatStepper): void {
    this.isOrderPlaced = true;
    const name = this.firstFormGroup.get('first_name').value + ' ' + this.firstFormGroup.get('last_name').value;
    const cartCloned = cloneDeep(this.cart);
    let formValue = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      cart: cartCloned,
    }; // Copying cart should be deep copied. Otherwise, cart will be changed.

    this.submitted = true;
    this.shipmentLoading = true;
    this.stripeService.createToken(this.card.element, { name }).subscribe((result) => {
      stepper.next();
      if (result.token) {
        const tokenId = result.token.id;
        const shipmentInfo = this.checkoutService.buildShipment(this.cart, this.cmsSettings, this.secondFormGroup, this.thirdFormGroup, this.selectedCounty);
        formValue = {
          ...formValue,
          phone: formValue.phone.internationalNumber,
        };
        if (shipmentInfo) {
          this.orderService
            .createStripePayment(formValue, tokenId, shipmentInfo)
            .pipe(
              finalize(() => {
                this.shipmentLoading = false;
                this.submitted = false;
              }),
            )
            .subscribe(
              (response) => {
                if (response.success) {
                  this.stripeFormError = '';
                  this.shipment = response.result.shipment;
                  this.createdOrder = response.result._doc;
                  if (this.shipment) {
                    const ratesError = this.shipment.messages ? this.shipment.messages.find((message) => message.type === 'rate_error') : null;
                    if (!this.shipment.rates || this.shipment.rates.length === 0 || ratesError) {
                      this.shippingRatesError = 'USER.CHECKOUT.SHIPPING_RATES_ERROR';
                    } else {
                      this.shipment.rates.forEach((rateItem) => (rateItem.rate = Number(rateItem.rate)));
                    }
                  }
                  this.formValue = formValue;
                }
              },
              (error: any) => {
                this.selectedRate = null;
                if (error.error && !error.error.success && error.error.error) {
                  if (error.error.shipping || error.error.notValidStoreAddress || error.error.notValidAddress) {
                    this.handelShippingValidations(error);
                  } else {
                    this.sharedServiceLib.openSnackBar(error.error.error, '', SNACKBARTYPE.error);
                  }
                  this.stripeFormError = error.error.error;
                } else {
                  this.stripeFormError = error.error.error._message;
                  const err = error.info || error.error.error._message;
                  if (err) this.sharedServiceLib.openSnackBar(err, '', SNACKBARTYPE.error);
                  else {
                    this.translateService.get('SNACKBAR.SOMETHING_WENT_WRONG').subscribe((translation) => {
                      this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.error);
                    });
                  }
                }
              },
            );
        }
      } else if (result.error) {
        this.stripeFormError = result.error.message;
      }
    });
  }

  public handleAddressChange(address: any): void {
    const countryObject = this.countriesList.find((country) => country?.country_short_name === address.country);
    this.googleAddressState = address.state;
    if (!this.statesList.length) {
      this.countryChange(this.secondFormGroup.get('country').value);
    }

    if (countryObject) {
      if (this.googleAddressState && this.selectedCounty === countryObject && this.statesList) {
        this.handleGoogleAddressState();
      } else {
        this.selectedCounty = countryObject;
        this.secondFormGroup.controls['country'].setValue(countryObject.country_name);
      }
    }

    this.secondFormGroup.controls['town'].setValue(address.town);
    this.secondFormGroup.controls['address_line_1'].setValue(address.street_number + ' ' + address.street);
    this.secondFormGroup.controls['postal_code'].setValue(address.postal_code);
    this.secondFormGroup.controls['address'].setValue(address.fullAddress);
  }

  public getCarrierLogo(carrierName): string {
    const carrier = this.carriers.find((value) => value.name === carrierName);
    return carrier ? carrier.logo : '';
  }

  public rateToggleChange(event, rate, rateIndex): void {
    this.shipment.rates.forEach((value, index) => (value.selected = index !== rateIndex ? false : event.checked));
    this.selectedRate = event.checked ? this.shipment.rates[rateIndex] : null;
  }

  public buyShipment(): void {
    this.shipmentLoading = true;
    const request = {
      shipmentId: this.shipment.id,
      rateId: this.selectedRate.id,
      amount: this.selectedRate.rate,
      orderId: this.createdOrder._id,
    };
    this.httpUtilService
      .postRequest(SHIPPING_APIS.buyShipment, request)
      .pipe(
        finalize(() => {
          this.shipmentLoading = false;
        }),
      )
      .subscribe(
        (result: any) => {
          this.translateService.get('SNACKBAR.PAID').subscribe((translation) => {
            this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.success);
          });
          this.cartService.emptyCart();
          this.resetMultiStepForm();
          const shipment = result.shipment;
          shipment.tracker = result.tracker;
          this.cartService.addToOrder({
            ...this.formValue,
            shipment,
          });
          this.submitEvent.emit(shipment);
        },
        (error) => {
          this.translateService.get('SNACKBAR.PAID_ERROR').subscribe((translation) => {
            this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.error);
          });
        },
      );
  }

  public stripeCardChange(stripeFormChangeEvent) {
    this.isStripeFormCompleted = stripeFormChangeEvent.complete;
  }

  public onKeyDown(event: any): boolean {
    return /[a-z]/i.test(event.key);
  }

  private resetControl(name): void {
    this.secondFormGroup.get(name).reset();
    this.secondFormGroup.get(name).markAllAsTouched();
  }

  private handelShippingValidations(error): void {
    switch (true) {
      case error.error.notValidAddress: {
        this.translateService.get('SNACKBAR.NOT_VALID_ADDRESS').subscribe((translation) => {
          this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.error);
        });
        this.stepper.selectedIndex = 1;
        break;
      }
      case error.error.notValidStoreAddress: {
        this.translateService.get('SNACKBAR.NOT_VALID_STORE_ADDRESS').subscribe((translation) => {
          this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.error);
        });
        break;
      }
      case error.error.shipping: {
        this.translateService.get('SNACKBAR.ERROR_CREATE_SHIPMENT').subscribe((translation) => {
          this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.error);
        });
        break;
      }
    }
  }

  private handleGoogleAddressState(): void {
    const stateObject = this.statesList.find((state) => this.googleAddressState.toUpperCase().indexOf(state.state_name.toUpperCase()) !== -1);
    if (stateObject) {
      this.secondFormGroup.controls['state'].setValue(stateObject.state_name);
      this.selectedState = stateObject;
      this.secondFormGroup.markAllAsTouched();
    } else {
      this.resetControl('state');
    }
  }

  public checkinput(event): boolean {
    const charCode = event.charCode;
    return (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 || (charCode >= 48 && charCode <= 57);
  }
}
