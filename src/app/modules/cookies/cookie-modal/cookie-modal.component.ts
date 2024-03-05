import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Cms } from '../../cms/cms.model';
import { CmsService } from '../../cms/cms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cookie-modal',
  templateUrl: './cookie-modal.component.html',
  styleUrls: ['./cookie-modal.component.scss'],
})
export class CookieModalComponent implements OnInit, OnDestroy {
  public closePopup: any = false;
  private $cookieConsentService: Subscription;
  private $translateServiceLangChange: Subscription;

  constructor(private cookieConsentService: NgcCookieConsentService, private cmsService: CmsService, private translateService: TranslateService) {
    this.closePopup = this.getCookie('cookieconsent_status');
    this.$cookieConsentService = this.cookieConsentService.statusChange$.subscribe((status) => {
      this.cookieConsentService.destroy();
      this.closePopup = true;
    });
  }
  ngOnInit(): void {
    this.$translateServiceLangChange = this.translateService.onLangChange.subscribe((res) => {
      this.initCookies(res.lang);
    });
    this.initCookies(this.translateService.currentLang);
  }

  private initCookies(lang: string) {
    this.cmsService.entities$.subscribe((value: Cms[]) => {
      if (value && value.length > 0 && value[0].cookiesContent) {
        const cookiesContent = value[0].cookiesContent[lang];
        this.cookieConsentService.getConfig().elements = {
          'custom-modal': `
              <div id="cookieconsent:desc" class="cc-message">
                 <div class="cookie-modal-header">
                     <h2>${this.translateService.instant('COOKIE.POPUP_HELLO')}!</h2>
                 </div>
                 <div class="cookie-modal-body">
                   <img src="assets/images/logo-2.png" alt="" />
                   <p>${cookiesContent}</p>
                 </div>
              </div>
            `,
        };
        this.cookieConsentService.getConfig().content.allow = this.translateService.instant('COOKIE.POPUP_ALLOW');
        this.cookieConsentService.getConfig().content.deny = this.translateService.instant('COOKIE.POPUP_DENY');
        this.cookieConsentService.init(this.cookieConsentService.getConfig());
      }
    });
  }
  ngOnDestroy(): void {
    this.$cookieConsentService && this.$cookieConsentService.unsubscribe();
    this.$translateServiceLangChange && this.$translateServiceLangChange.unsubscribe();
  }

  public openCookieModal() {
    this.cookieConsentService.open();
  }

  public acceptCookie() {
    document.cookie = 'cookieconsent_status=allow';
    this.closePopup = true;
  }

  public denyCookie() {
    document.cookie = 'cookieconsent_status=deny';
    this.closePopup = true;
  }

  private getCookie(cname): string {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
}
