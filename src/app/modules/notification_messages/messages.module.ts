import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IonicModule } from '@ionic/angular';

import { NgSelectModule } from '@ng-select/ng-select';
import { NextsapienComponentLibModule, LibAgGridModule } from 'nextsapien-component-lib';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgGridModule } from '../../shared/ag-grid/ag-grid.module';
import { MessageComponent } from './message.component';

const routes: Routes = [
  { path: '', component: MessageComponent },
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
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    NextsapienComponentLibModule,
    LibAgGridModule,
    AgGridModule,
    SharedModule,
  ],
  declarations: [MessageComponent],
})
export class MessagesModule {}
