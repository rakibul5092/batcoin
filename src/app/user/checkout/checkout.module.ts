import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { NgSelectModule } from '@ng-select/ng-select';

import { GoogleAddressInputModule, PipeModule, TypographyModule } from 'nextsapien-component-lib';
import { NgxStripeModule } from 'ngx-stripe';

import { SharedModule } from '../../shared/shared.module';
import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { AddressFormComponent } from './address-form/address-form.component';
import { CheckoutPage } from './checkout.page';
import { CongratulationsComponent } from './congratulations/congratulations.component';

import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { environment } from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.stripeApiKey),
    IonicModule,
    TypographyModule,
    SharedModule,
    CheckoutPageRoutingModule,
    PipeModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    GoogleAddressInputModule,
    // NgxIntlTelInputModule,
    NgxMatIntlTelInputComponent,
  ],
  declarations: [CheckoutPage, AddressFormComponent, CongratulationsComponent],
  exports: [AddressFormComponent],
})
export class CheckoutPageModule {}
