import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SkeletonModule } from 'primeng/skeleton';

import { ViewStatusPipe } from './pipes/view-status.pipe';
import { SummaryPipe } from './pipes/summary.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ImageWithLoadingModule } from './image-with-loading/image-with-loading.module';

@NgModule({
  declarations: [ViewStatusPipe, SummaryPipe],
  imports: [CommonModule, IonicModule, MatIconModule, MatButtonModule, RouterModule, TranslateModule, SkeletonModule, ImageWithLoadingModule],
  exports: [ViewStatusPipe, TranslateModule, SkeletonModule, ImageWithLoadingModule],
})
export class SharedModule {}
