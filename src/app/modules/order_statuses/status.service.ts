import { Injectable } from '@angular/core';

import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Status } from './status.model';
import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory } from 'nextsapien-component-lib';

import { AgGridButtonsComponent } from '../../shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';

@Injectable({
  providedIn: 'root',
})
export class StatusService extends PopulatedEntityCollectionServiceBase<Status> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, populateEntityDataServiceFactory: PopulateEntityDataServiceFactory) {
    super('order_statuses', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  constructColumnDefs(componentRef): any[] {
    return [
      { headerName: 'ADMIN.ORDER_STATUS.NAME', field: 'name' },
      {
        headerName: 'ADMIN.ORDER_STATUS.DEFAULT_STATUS',
        field: 'default_status',
      },
      {
        headerName: 'ADMIN.ORDER_STATUS.ACTIONS',
        field: 'action',
        sortable: false,
        filter: false,
        cellRendererFramework: AgGridButtonsComponent,
        cellRendererParams: {
          view: true,
          deleteAttributeName: 'isDeleted',
          dialogService: componentRef.dialogService,
          clicked: (action, row, rowIndex) => componentRef.onRowActionClick(action, row, rowIndex),
        },
      },
    ];
  }
}
