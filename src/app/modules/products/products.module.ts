import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule, FileManagerModule, ImageGalleryModule, LanguageToggleModule, LibAgGridModule, NextsapienComponentLibModule, PipeModule } from 'nextsapien-component-lib';

import { SharedModule } from 'src/app/shared/shared.module';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from '../../shared/ag-grid/ag-grid.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductDetailsViewComponent } from './product-details-view/product-details-view.component';
import { AddImageViaUrlComponent } from './add-image-via-url/add-image-via-url.component';
import { ProductComponent } from './product.component';

const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    NgSelectModule,
    DragDropModule,

    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,

    SharedModule,
    NextsapienComponentLibModule,
    LibAgGridModule,
    PipeModule,
    AgGridModule,
    FileManagerModule,
    ImageGalleryModule,
    LanguageToggleModule,
    DirectiveModule,
  ],
  declarations: [ProductComponent, ProductDetailComponent, ProductDetailsViewComponent, AddImageViaUrlComponent],
})
export class ProductsModule {}
