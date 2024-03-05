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
import { LibAgGridModule, NextsapienComponentLibModule } from 'nextsapien-component-lib';

import { SharedModule } from 'src/app/shared/shared.module';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from '../../shared/ag-grid/ag-grid.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderComponent } from './order.component';
import { UpdateStatusComponent } from './update-status/update-status.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: ':orderID', component: OrderComponent },
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
  declarations: [OrderComponent, OrderDetailComponent, UpdateStatusComponent],
})
export class OrdersModule {}
