import { Injectable } from '@angular/core';

import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory } from 'nextsapien-component-lib';

import { Query } from './query.model';
import { AgGridButtonsComponent } from '../../shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';

@Injectable({
  providedIn: 'root',
})
export class ContactQueriesService extends PopulatedEntityCollectionServiceBase<Query> {
  public columnsHideStrategy = new Map([
    ['message', 900],
    ['email', 580],
    ['name', 380],
  ]);

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, populateEntityDataServiceFactory: PopulateEntityDataServiceFactory) {
    super('contact_queries', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  public constructColumnDefs(componentRef): any[] {
    return [
      { headerName: 'ADMIN.CONTACT_QUERIES.NAME', field: 'name' },
      { headerName: 'ADMIN.CONTACT_QUERIES.EMAIL', field: 'email' },
      { headerName: 'ADMIN.CONTACT_QUERIES.SUBJECT', field: 'subject' },
      { headerName: 'ADMIN.CONTACT_QUERIES.MESSAGE', field: 'message' },
      {
        headerName: 'ADMIN.CONTACT_QUERIES.ACTIONS',
        field: 'action',
        sortable: false,
        filter: false,
        cellRendererFramework: AgGridButtonsComponent,
        cellRendererParams: {
          view: true,
          hideEdit: true,
          clicked: (action, row, rowIndex) => componentRef.onRowActionClick(action, row, rowIndex),
        },
      },
    ];
  }
}
