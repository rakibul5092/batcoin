import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageWithLoadingComponent } from './image-with-loading.component';

@NgModule({
  declarations: [ImageWithLoadingComponent],
  imports: [CommonModule],
  exports: [ImageWithLoadingComponent],
})
export class ImageWithLoadingModule {}
