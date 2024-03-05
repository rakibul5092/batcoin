import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IonicModule } from '@ionic/angular';

import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule, NextsapienComponentLibModule, LibAgGridModule } from 'nextsapien-component-lib';

import { SharedModule } from 'src/app/shared/shared.module';

import { QueryComponent } from './query.component';
import { QueryDetailComponent } from './query-detail/query-detail.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from '../../shared/ag-grid/ag-grid.module';

const routes: Routes = [
  { path: '', component: QueryComponent },
  { path: ':queryID', component: QueryComponent },
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
    DirectiveModule,
  ],
  declarations: [QueryComponent, QueryDetailComponent],
})
export class QueriesModule {}
