import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';

import { NgcCookieConsentModule } from 'ngx-cookieconsent';

import { COOKIES_CONFIG } from './cookies.lookup';
import { CookieModalComponent } from './cookie-modal/cookie-modal.component';

@NgModule({
  declarations: [CookieModalComponent],
  imports: [CommonModule, MatButtonModule, TranslateModule, NgcCookieConsentModule.forRoot(COOKIES_CONFIG)],
  exports: [CookieModalComponent],
})
export class CookiesModule {}
