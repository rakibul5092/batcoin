import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PipeModule } from 'nextsapien-component-lib';
import { SwiperModule } from 'swiper/angular';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { SlideComponent } from './slide/slide.component';
import { ImageWithLoadingModule } from '../../shared/image-with-loading/image-with-loading.module';

@NgModule({
  imports: [CommonModule, IonicModule, SkeletonModule, TranslateModule, HomePageRoutingModule, SwiperModule, ImageWithLoadingModule, PipeModule],
  declarations: [HomePage, SlideComponent],
})
export class HomePageModule {}
