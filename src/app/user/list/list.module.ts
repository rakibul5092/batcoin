import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { TypographyModule, PipeModule } from 'nextsapien-component-lib';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { ListItemComponent } from './list-item/list-item.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, IonicModule, SharedModule, ListPageRoutingModule, TypographyModule, PipeModule],
  exports: [ListPage, ListItemComponent],
  declarations: [ListPage, ListItemComponent],
})
export class ListPageModule {}
