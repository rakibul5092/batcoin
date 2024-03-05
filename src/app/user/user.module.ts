import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';

import { AppMenuModule, LanguageToggleModule } from 'nextsapien-component-lib';

import { UserPageRoutingModule } from './user-routing.module';

import { UserPage } from './user.page';

import { TranslateModule } from '@ngx-translate/core';
import { UnderConstructionComponent } from './under-construction/under-construction.component';

@NgModule({
  imports: [CommonModule, IonicModule, MatTooltipModule, UserPageRoutingModule, AppMenuModule, TranslateModule, LanguageToggleModule],
  declarations: [UserPage, UnderConstructionComponent],
  providers: [],
})
export class UserPageModule {}
