import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NextsapienComponentLibModule, FileManagerModule, GoogleAddressInputModule, FormAddressModule } from 'nextsapien-component-lib';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { SharedModule } from 'src/app/shared/shared.module';
import { AgGridModule } from 'src/app/shared/ag-grid/ag-grid.module';

import { CmsComponent } from './cms.component';
import { MatOptionModule } from '@angular/material/core';

const routes: Routes = [
  { path: '', component: CmsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  declarations: [CmsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    NgSelectModule,
    DragDropModule,
    MatExpansionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,

    SharedModule,
    NextsapienComponentLibModule,
    AgGridModule,
    FileManagerModule,
    GoogleAddressInputModule,
    FormAddressModule,
  ],
})
export class CmsModule {}
