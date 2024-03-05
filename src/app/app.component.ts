import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { Cms } from './modules/cms/cms.model';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public noOfItems = 0;
  public cmsSettings: Cms;
  public cookiePromptStatus: boolean;
  public fu;

  private cmsSub: Subscription;
  private favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    @Inject('environment') private environment: any,
    private menu: MenuController,
    public translate: TranslateService,
    private sharedService: SharedService,
  ) {
    // Register translation languages
    translate.addLangs(['en', 'fr', 'es']);
    // Set default language
    translate.setDefaultLang('en');
    // Check for language in localStorage
    localStorage.getItem('language') ? translate.use(localStorage.getItem('language')) : translate.use('en');
  }

  ngOnInit(): void {
    this.cmsSub = this.sharedService.cmsSettingsObs.subscribe((cms) => {
      if (cms === null) return;

      this.cmsSettings = cms;
      if (this.cmsSettings.favicon) {
        this.changeIcon(this.sharedService.getS3ImageUrl(this.cmsSettings.favicon));
      }
      this.cookiePromptStatus = !cms.disableCookiesModal;
    });
    if (this.environment.smartLookEnabled) {
      const script = this._renderer2.createElement('script');
      script.type = 'text/javascript';
      script.text = `
        window.smartlook||(function(d) {
          var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
          var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
          c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
          })(document);
          smartlook('init', 'a2f3760688ed40652e1889c133569ca789aa3d00', { region: 'eu' });
      `;

      this._renderer2.appendChild(this._document.body, script);
    }
  }

  ngOnDestroy(): void {
    this.cmsSub?.unsubscribe();
  }

  public openMenu() {
    this.menu.open('main');
  }

  private changeIcon(icon: string = 'favicon.ico') {
    this.favIcon.href = icon;
  }
}
