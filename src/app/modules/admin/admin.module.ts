import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NextsapienComponentLibModule, LanguageToggleModule, AppMenuModule, SocketService } from 'nextsapien-component-lib';
import { NgSelectModule } from '@ng-select/ng-select';

import { AdminPageRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminPage } from './admin.page';
import { NotificationListItemComponent } from './notification-list-item/notification-list-item.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,

    NgSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,

    AdminPageRoutingModule,
    NextsapienComponentLibModule,
    LanguageToggleModule,
    AppMenuModule,
  ],
  declarations: [AdminPage, NotificationListItemComponent],
  providers: [SocketService],
})
export class AdminPageModule {}
