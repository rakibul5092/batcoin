import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PipeModule, TypographyModule } from 'nextsapien-component-lib';

import { CartPageRoutingModule } from './cart-routing.module';
import { CartPage } from './cart.page';
import { CheckoutPageModule } from '../checkout/checkout.module';
import { ImageWithLoadingModule } from '../../shared/image-with-loading/image-with-loading.module';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    IonicModule,
    TypographyModule,
    CartPageRoutingModule,
    CheckoutPageModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    InputNumberModule,
    MatTooltipModule,
    TranslateModule,
    ImageWithLoadingModule,
    PipeModule,
    MatFormFieldModule,
  ],
  declarations: [CartPage],
})
export class CartPageModule {}
