import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AdminModuleEntityBase, SharedService, SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';
import { NotificationMessage } from 'src/app/modules/notification_messages/message.model';
import { MessageService } from 'src/app/modules/notification_messages/message.service';
import { SharedService as SharedAppService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent extends AdminModuleEntityBase implements OnInit, OnDestroy {
  public columnsHideStrategy: Map<string, number>;
  public columnDefs: any[] = this.notificationMessageService.constructColumnDefs(this);
  public override showDeletedItems: boolean = false;
  public messages$: Observable<NotificationMessage[]>;
  public loading$: Observable<boolean>;
  public model = 'notification_messages';
  private user: any = {};
  private currentCount: number = 0;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private notificationMessageService: MessageService,
    private socket: SocketService,
    private sharedAppService: SharedAppService,
    private dialogService: MatDialog,
    private sharedService: SharedService,
    public translateAppService: TranslateService,
  ) {
    super('notification_messages', notificationMessageService, sharedService, dialogService, translateAppService);
    this._unsubscribeAll = new Subject();
    this.messages$ = notificationMessageService.entities$.pipe(
      map((value: any[]) => {
        return this.showDeletedItems ? value.filter((item) => item.isDeleted) : value;
      }),
    );
    this.loading$ = notificationMessageService.loading$;
    this.user = JSON.parse(localStorage['user']);
  }

  ngOnInit() {
    this.socket.counts.pipe(takeUntil(this._unsubscribeAll)).subscribe((count) => {
      if (count && count.notifications > 0 && count.notifications !== this.currentCount) {
        this.currentCount = count.notifications;
      }
      this.getData();
    });
    this.getData();

    this.columnsHideStrategy = this.notificationMessageService.columnsHideStrategy;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public override pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public override getData(conditions: Object = {}, populate: string = '', limit: string = '10', skip: string = '0') {
    conditions = { to: this.user._id };
    this.notificationMessageService.clearCache();
    this.notificationMessageService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public openNotification = (notification) => this.notificationMessageService.openNotification(notification);

  public markAsRead(notification) {
    notification = { ...notification, read: true };
    this.notificationMessageService.update(notification).subscribe((response) => {
      this.socket.getNotifications();
      this.getData();
      this.translateAppService.get('SNACKBAR.MARK_AS_READ').subscribe((translation) => {
        this.sharedAppService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public deleteNotification(notification) {
    this.notificationMessageService.delete(notification).subscribe((response) => {
      this.socket.getNotifications();
      this.getData();
      this.translateAppService.get('SNACKBAR.DELETED_SUCCESSFULLY').subscribe((translation) => {
        this.sharedAppService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public onRowActionClick(action, row, rowIndex): void {
    switch (action) {
      case 'markAsRead':
        this.markAsRead(row);
        break;
      case 'delete':
        this.deleteNotification(row);
        break;
    }
  }

  onExport(event) {
    this.notificationMessageService.getWithPopulatedFields({}, '', null, '0', '-created_at').subscribe(() => {
      setTimeout(() => {
        event.gridApi.exportDataAsCsv({
          fileName: event.fileName,
          columnKeys: event.columnKeys,
        });
        this.getData();
      }, 2000);
    });
  }
}
