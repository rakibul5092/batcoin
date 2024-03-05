import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactUsPageRoutingModule } from './contact-us-routing.module';

import { ContactUsPage } from './contact-us.page';
import { QueryFormComponent } from './query-form/query-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DirectiveModule } from 'nextsapien-component-lib';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    ContactUsPageRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    DirectiveModule,
  ],
  declarations: [ContactUsPage, QueryFormComponent],
})
export class ContactUsPageModule {}
