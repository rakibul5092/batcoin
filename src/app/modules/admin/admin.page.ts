import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';

import { AuthService, SharedService, SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';
import { SharedService as SharedAppService } from 'src/app/shared/shared.service';
import { Cms, DEFAULT_CMS } from '../cms/cms.model';
import { NotificationMessage } from '../notification_messages/message.model';
import { MessageService } from '../notification_messages/message.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {
  private noOfItems = 0;
  private currentCount: number = 0;
  private cartSub: Subscription;

  public user: any = {};

  private _unsubscribeAll: Subject<any>;

  public counts$: BehaviorSubject<any> = new BehaviorSubject({});
  public messages$: Observable<NotificationMessage[]>;
  public newMessage: boolean = false;
  public earlierMessage: boolean = false;

  public menuItems = [
    {
      name: 'COMMON.MENU.PRODUCTS',
      link: '/admin/products',
    },
    {
      name: 'COMMON.MENU.ORDERS',
      link: '/admin/orders',
    },
    {
      name: 'COMMON.MENU.CONTACT',
      link: '/admin/contact',
    },
    {
      name: 'COMMON.MENU.NOTIFICATION_MESSAGES',
      link: '/admin/messages',
    },
  ];

  public translatedMenuItems = [];

  public cmsSettings: Cms;

  constructor(
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService,
    private notificationMessageService: MessageService,
    private sharedService: SharedService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private sharedAppService: SharedAppService,
  ) {
    this._unsubscribeAll = new Subject();
    this.user = JSON.parse(localStorage['user']);

    if (authService.isAdmin()) {
      this.menuItems.push(
        {
          name: 'Cms',
          link: '/admin/cms',
        },
        {
          name: 'COMMON.MENU.USERS',
          link: '/admin/users',
        },
        {
          name: 'COMMON.MENU.USER_ROLES',
          link: '/admin/roles',
        },
        {
          name: 'COMMON.MENU.ORDER_STATUS',
          link: '/admin/statuses',
        },
      );
    }
    this.translatedMenuItems = this.menuItems;
    this.updateTranslations();
  }

  ngOnInit(): void {
    this.socketService.notifications.pipe(takeUntil(this._unsubscribeAll)).subscribe((notification) => {
      this.noOfItems += 1;
    });
    this.socketService.counts.subscribe((count) => {
      if (count.notifications !== this.currentCount) {
        this.currentCount = count.notifications;
        this.counts$.next(count);
        this.getFirstNotificaionMessages();
      }
    });
    this.socketService.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'user' && this.user._id === change._id && change.action === 'delete') {
        this.logout();
      }
    });

    this.sharedAppService.cmsSettingsObs.subscribe((settings) => {
      if (settings) {
        this.cmsSettings = settings;
        this.cmsSettings = {
          ...this.cmsSettings,
          logo: !this.cmsSettings.logo || this.cmsSettings.logo === DEFAULT_CMS.logo ? DEFAULT_CMS.logo : this.sharedAppService.getS3ImageUrl(this.cmsSettings.logo),
        };
      }
    });

    this.translateService.onLangChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.updateTranslations();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private getNotificationMessage(conditions: Object = { to: this.user._id }, populate: string = 'contact_query order', limit: string = '5', skip: string = '0') {
    this.messages$ = this.notificationMessageService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  private getFirstNotificaionMessages() {
    this.getNotificationMessage();
    // subscribe to the returned observeable first time
    this.messages$.subscribe((messages) => {
      this.newMessage = messages.findIndex((message) => message.is_viewed === false) >= 0 ? true : false;
      this.earlierMessage = messages.findIndex((message) => message.is_viewed === true) >= 0 ? true : false;
    });
  }

  public openNotification(notification) {
    this.notificationMessageService.openNotification(notification);
  }

  public markAsRead(notification) {
    notification = { ...notification, read: true };
    this.notificationMessageService.update(notification).subscribe((response) => {
      this.socketService.getNotifications();
      this.getNotificationMessage();
      this.translateService.get('SNACKBAR.MARK_AS_READ').subscribe((translation) => {
        this.sharedAppService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public deleteNotification(notification) {
    this.notificationMessageService.delete(notification).subscribe((response) => {
      this.socketService.getNotifications();
      this.getNotificationMessage();
      this.translateService.get('SNACKBAR.DELETED_SUCCESSFULLY').subscribe((translation) => {
        this.sharedAppService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public updateViewedStatus() {
    if (!this.messages$) return;
    this.messages$.pipe(take(1)).subscribe((messages) => {
      if (messages.length > 0) {
        messages.forEach((message) => {
          if (!message.is_viewed) {
            this.notificationMessageService.update({ is_viewed: true, _id: message._id }).subscribe((response) => {});
          }
        });
      }
    });
  }

  private updateTranslations(): void {
    // This subscription completes automatically so no need to unsubscribe.
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
