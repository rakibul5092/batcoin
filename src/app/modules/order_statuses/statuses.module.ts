import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IonicModule } from '@ionic/angular';

import { NextsapienComponentLibModule, LibAgGridModule } from 'nextsapien-component-lib';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedModule } from 'src/app/shared/shared.module';

import { StatusComponent } from './status.component';
import { StatusDetailComponent } from './status-detail/status-detail.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from '../../shared/ag-grid/ag-grid.module';
import { OrderStatusViewComponent } from './order-status-view/order-status-view.component';

const routes: Routes = [
  { path: '', component: StatusComponent },
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

    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,

    SharedModule,
    NextsapienComponentLibModule,
    LibAgGridModule,
    AgGridModule,
  ],
  declarations: [StatusComponent, StatusDetailComponent, OrderStatusViewComponent],
})
export class StatusesModule {}
