import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipeModule, TypographyModule } from 'nextsapien-component-lib';
import { NgxImageZoomModule } from 'ngx-image-zoom';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { RelatedItemComponent } from './related-item/related-item.component';
import { SharedModule } from '../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [CommonModule, FormsModule, NgxImageZoomModule, IonicModule, TypographyModule, SharedModule, ProductPageRoutingModule, PipeModule, MatFormFieldModule],
  declarations: [ProductPage, RelatedItemComponent],
})
export class ProductPageModule {}
