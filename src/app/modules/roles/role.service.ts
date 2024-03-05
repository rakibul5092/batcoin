import { Injectable } from '@angular/core';

import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Role } from './role.model';
import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory } from 'nextsapien-component-lib';

import { AgGridButtonsComponent } from '../../shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends PopulatedEntityCollectionServiceBase<Role> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, populateEntityDataServiceFactory: PopulateEntityDataServiceFactory) {
    super('user_roles', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  public constructColumnDefs(componentRef): any[] {
    return [
      { headerName: 'ADMIN.ROLE.NAME', field: 'name' },
      {
        headerName: 'ADMIN.ROLE.ACTIONS',
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
