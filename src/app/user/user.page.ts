import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Cms, DEFAULT_CMS } from '../modules/cms/cms.model';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, OnDestroy {
  public cmsSettings: Cms;
  private _unsubscribeAll: Subject<any>;

  public disableTooltips: boolean;
  public noOfItems = 0;
  private cartSub: Subscription;
  public menuItems = [
    {
      name: 'USER.MENU.HOME',
      link: '/',
    },
    {
      name: 'USER.MENU.LIST',
      link: '/list',
    },
    {
      name: 'USER.MENU.CONTACT_US',
      link: '/contact-us',
    },
    {
      name: 'USER.MENU.CART',
      link: '/cart',
    },
  ];

  public translatedMenuItems = [];

  constructor(private cartService: CartService, private translateService: TranslateService, private sharedService: SharedService) {
    this._unsubscribeAll = new Subject();
    this.translatedMenuItems = this.menuItems;
    this.updateTranslations();
  }

  ngOnInit(): void {
    this.cartSub = this.cartService.carts.subscribe((cart) => {
      if (cart.items) {
        this.noOfItems = cart.items.length;
      }
    });
    this.sharedService.cmsSettingsObs.subscribe((cms) => {
      this.disableTooltips = !cms?.disableTooltips;
    });
    this.translateService.onLangChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.updateTranslations();
    });
    this.cmsSettings = this.sharedService.getCmsSettings();
    if (this.cmsSettings) {
      this.cmsSettings = {
        ...this.cmsSettings,
        logo: !this.cmsSettings.logo || this.cmsSettings.logo === DEFAULT_CMS.logo ? DEFAULT_CMS.logo : this.sharedService.getS3ImageUrl(this.cmsSettings.logo),
      };
    }
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  private updateTranslations(): void {
    this.translateService.get([...this.menuItems.map((m) => m.name)]).subscribe((translations) => {
      this.translatedMenuItems = this.menuItems.map((item) => {
        return {
          ...item,
          name: translations[item.name],
        };
      });
    });
  }
}
