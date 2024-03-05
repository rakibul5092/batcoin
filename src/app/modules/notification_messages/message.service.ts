import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory } from 'nextsapien-component-lib';
import { NotificationMessage } from './message.model';

import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AgGridButtonsComponent } from 'src/app/shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends PopulatedEntityCollectionServiceBase<NotificationMessage> {
  public columnsHideStrategy = new Map<string, number>([['created_at', 600]]);

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    populateEntityDataServiceFactory: PopulateEntityDataServiceFactory,
    private router: Router,
    private datePipe: DatePipe,
    private translateService: TranslateService,
  ) {
    super('notification_messages', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  public openNotification(notification: NotificationMessage) {
    if (notification.contact_query) {
      this.router.navigate(['/admin', 'contact', notification._id]);
    } else {
      this.router.navigate(['/admin', 'orders', notification._id]);
    }
  }

  public constructColumnDefs(componentRef): any[] {
    return [
      {
        headerName: 'ADMIN.NOTIFICATION_MESSAGE.MESSAGE',
        field: 'message',
        valueGetter: this.getMessage.bind(this),
      },
      {
        headerName: 'ADMIN.NOTIFICATION_MESSAGE.CREATED_AT',
        field: 'created_at',
        valueGetter: this.dateFormatter.bind(this, 'created_at'),
      },
      {
        headerName: 'ADMIN.NOTIFICATION_MESSAGE.ACTIONS',
        field: 'action',
        sortable: false,
        filter: false,
        cellRendererFramework: AgGridButtonsComponent,
        cellRendererParams: {
          hideEdit: true,
          markAsRead: true,
          deleteAttributeName: 'isDeleted',
          clicked: (action, row, rowIndex) => componentRef.onRowActionClick(action, row, rowIndex),
        },
      },
    ];
  }

  private dateFormatter = (field: string, param: any) => {
    const date = this.datePipe.transform(param.data[field], 'dd MMM YYYY, HH:mm:ss a');
    return date;
  };
  private getMessage(params) {
    return this.translateService.instant('ADMIN.NOTIFICATION_MESSAGE.' + params.data.message);
  }
}
