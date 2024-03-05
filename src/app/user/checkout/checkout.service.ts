import { Inject, Injectable, LOCALE_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { DynamicTranslationPipe, SharedService as SharedServiceLib, SNACKBARTYPE } from 'nextsapien-component-lib';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

import jspdf from 'jspdf';
import 'jspdf-autotable';

import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private translateService: TranslateService, private fb: UntypedFormBuilder, private sharedServiceLib: SharedServiceLib, @Inject(LOCALE_ID) private locale: string) {}

  /**
   * build shipment data
   * @param cart
   * @param cmsSettings
   * @param secondFormGroup
   * @param thirdFormGroup
   * @param selectedCounty
   */
  public buildShipment(cart: any, cmsSettings: any, secondFormGroup: UntypedFormGroup, thirdFormGroup: UntypedFormGroup, selectedCounty): any {
    let length = 0;
    let width = 0;
    let height = 0;
    let weight = 0;
    cart.items.forEach((item) => {
      if (item.product.parcel) {
        height += item.product.parcel.height || 0;
        width += item.product.parcel.width || 0;
        weight += item.product.parcel.weight || 0;
        length += item.product.parcel.pLength || 0;
      }
    });

    if (length === 0 || width === 0 || height === 0 || weight === 0) {
      this.translateService.get('SNACKBAR.PARCEL_INFO_REQUIRED').subscribe((translation) => {
        this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.error);
      });
      return null;
    }

    if (!cmsSettings || !cmsSettings.shipping) {
      this.translateService.get('SNACKBAR.NOT_VALID_STORE_ADDRESS').subscribe((translation) => {
        this.sharedServiceLib.openSnackBar(translation, '', SNACKBARTYPE.error);
      });
      return null;
    }

    return {
      fromAddress: {
        mode: environment.easyPostMode,
        street1: cmsSettings.shipping.address,
        city: cmsSettings.shipping.city,
        state: cmsSettings.shipping.state,
        zip: cmsSettings.shipping.zip,
        country: cmsSettings.shipping.country,
        company: 'BatCoin',
        phone: cmsSettings.shipping.phone,
      },
      toAddress: {
        mode: environment.easyPostMode,
        street1: secondFormGroup.value.address_line_1,
        city: secondFormGroup.value.town,
        state: secondFormGroup.value.state,
        zip: secondFormGroup.value.postal_code,
        country: selectedCounty.country_short_name,
        company: 'BatCoin',
        phone: thirdFormGroup.value.phone.internationalNumber,
      },
      parcel: {
        mode: environment.easyPostMode,
        length: length,
        width: width,
        height: height,
        predefined_package: null,
        weight: weight,
      },
      customsInfo: {
        mode: 'test',
        contents_explanation: null,
        contents_type: 'merchandise',
        customs_certify: true,
        customs_signer: 'Steve Brule',
        eel_pfc: 'NOEEI 30.37(a)',
        non_delivery_option: 'return',
        restriction_comments: null,
        restriction_type: 'none',
      },
    };
  }

  /**
   * build strip card options
   */
  public buildCardOptions(): StripeCardElementOptions {
    return {
      style: {
        base: {
          iconColor: '#666EE8',
          backgroundColor: '#fff',
          color: '#32325d',
          fontWeight: '300',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#32325d',
          },
        },
      },
    };
  }

  /**
   * build personal info form group
   */
  public personalInfoFormGroup(): UntypedFormGroup {
    return this.fb.group({
      first_name: [
        null,
        {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
        },
      ],
      last_name: [
        null,
        {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
        },
      ],
    });
  }

  /**
   * build address info form group
   */
  public addressInfoFormGroup(): UntypedFormGroup {
    return this.fb.group({
      address: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      country: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      address_line_1: [
        null,
        {
          validators: [Validators.required],
        },
      ],

      address_line_2: [null],
      town: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      state: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      postal_code: [
        null,
        {
          validators: [Validators.required],
        },
      ],
    });
  }

  /**
   * build contact info form group
   */
  public contactInfoFormGroup(): UntypedFormGroup {
    return this.fb.group({
      phone: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      email: [
        null,
        {
          validators: [Validators.required, Validators.email],
        },
      ],
    });
  }

  /**
   * download order details receipt
   * @param order
   */
  public downloadReceipt(order: any): void {
    const dynamicTranslationPipe = new DynamicTranslationPipe(this.translateService);
    if (!order || !order.cart || !order.shipment || !order.shipment.selected_rate) {
      return;
    }
    const doc: any = new jspdf({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });
    doc.setDocumentProperties({ title: 'Batcoin' });
    doc.setFontSize(18);
    this.translateService
      .get([
        'USER.CHECKOUT.CONGRATULATIONS.ORDER_DETAILS',
        'USER.CHECKOUT.CONGRATULATIONS.DATE',
        'USER.CHECKOUT.CONGRATULATIONS.CUSTOMER',
        'USER.CHECKOUT.ADDRESS.ADDRESS',
        'USER.CHECKOUT.CONGRATULATIONS.SHIPPING_RATE',
        'USER.CHECKOUT.CONGRATULATIONS.SHIPPING_TRACKER',
        'USER.CART.PRODUCT',
        'USER.CART.PRICE',
        'USER.CART.QUANTITY',
        'USER.CART.TOTAL',
        'USER.CHECKOUT.CONGRATULATIONS.FEES',
        'USER.CHECKOUT.CONGRATULATIONS.FEES',
        'USER.CHECKOUT.CONGRATULATIONS.BATCOIN_RECEIPT_pdf',
      ])
      .subscribe((t) => {
        doc.text(t['USER.CHECKOUT.CONGRATULATIONS.ORDER_DETAILS'], 13, 15);
        doc.setFontSize(11);
        doc.setTextColor(100);
        const today = formatDate(Date.now(), 'yyyy-MM-dd, h:mm a', this.locale);

        doc.text(`${t['USER.CHECKOUT.CONGRATULATIONS.DATE']} : ${today}`, 14, 23);
        doc.text(`${t['USER.CHECKOUT.CONGRATULATIONS.CUSTOMER']} : ${order.first_name} ${order.last_name}`, 14, 29);
        doc.text(`${t['USER.CHECKOUT.ADDRESS.ADDRESS']} :  ${order.address_line_1} ${order.town} ${order.state} ${order.country} ${order.postal_code}`, 14, 35);
        const head = [[t['USER.CART.PRODUCT'], t['USER.CART.PRICE'], t['USER.CART.QUANTITY'], t['USER.CART.TOTAL']]];
        const data = [];
        order.cart.items.forEach((item) => {
          data.push([dynamicTranslationPipe.transform(item.product.title), item.product.currentPrice, item.quantity, item.product.currentPrice * item.quantity]);
        });
        (doc as any).autoTable({
          theme: 'grid',
          margin: { top: 41 },
          head: head,
          body: data,
          didDrawCell: () => {},
        });

        const finalY = doc.lastAutoTable.finalY;
        doc.text(`${t['USER.CART.TOTAL']} : ${order.cart.total_price}`, 14, finalY + 10);
        doc.text(`${t['USER.CHECKOUT.CONGRATULATIONS.FEES']} : ${0}`, 14, finalY + 16);
        doc.text(`${t['USER.CHECKOUT.CONGRATULATIONS.SHIPPING_RATE']} : ${order.shipment.selected_rate.rate} ${order.shipment.selected_rate.currency}`, 14, finalY + 22);
        doc.text(`${t['USER.CHECKOUT.CONGRATULATIONS.SHIPPING_TRACKER']} : `, 14, finalY + 28);
        doc.text(order.shipment.tracker.public_url, 14, finalY + 33);
        // Open PDF document in new tab
        doc.output('dataurlnewwindow');
        // Download PDF document
        doc.save(t['USER.CHECKOUT.CONGRATULATIONS.BATCOIN_RECEIPT_pdf']);
      });
  }
}
