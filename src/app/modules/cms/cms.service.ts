import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DefaultDataServiceConfig, EntityCollectionServiceElementsFactory, HttpUrlGenerator } from '@ngrx/data';

import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory } from 'nextsapien-component-lib';
import { AgGridButtonsComponent } from 'src/app/shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';
import { Cms } from './cms.model';

@Injectable({
  providedIn: 'root',
})
export class CmsService extends PopulatedEntityCollectionServiceBase<Cms> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    populateEntityDataServiceFactory: PopulateEntityDataServiceFactory,
    protected override httpUrlGenerator: HttpUrlGenerator,
    protected override http: HttpClient,
    protected override config: DefaultDataServiceConfig,
  ) {
    super('cms', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  public constructColumnDefs(componentRef): any[] {
    return [
      { headerName: 'Module Name', field: 'moduleName' },
      { headerName: 'Section Name', field: 'moduleName' },
      {
        headerName: 'Actions',
        field: 'action',
        sortable: false,
        filter: false,
        cellRendererFramework: AgGridButtonsComponent,
        cellRendererParams: {
          deleteAttributeName: 'isDeleted',
          clicked: (action, row, rowIndex) => componentRef.onRowActionClick(action, row, rowIndex),
        },
      },
    ];
  }
}
