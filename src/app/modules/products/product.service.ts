import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DefaultDataServiceConfig, EntityCollectionServiceElementsFactory, HttpUrlGenerator } from '@ngrx/data';

import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory } from 'nextsapien-component-lib';

import { ValueGetterParams } from '@ag-grid-community/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridButtonsComponent } from '../../shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';
import { AgGridToggleComponent } from '../../shared/ag-grid/ag-grid-toggle/ag-grid-toggle.component';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends PopulatedEntityCollectionServiceBase<Product> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    populateEntityDataServiceFactory: PopulateEntityDataServiceFactory,
    protected override httpUrlGenerator: HttpUrlGenerator,
    protected override http: HttpClient,
    protected override config: DefaultDataServiceConfig,
    private translateService: TranslateService,
  ) {
    super('products', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  public constructColumnDefs(componentRef: any): any[] {
    return [
      {
        headerName: 'ADMIN.PRODUCTS.TITLE',
        valueGetter: this.localizeField.bind(this, 'title'),
        field: 'title',
      },
      {
        headerName: 'ADMIN.PRODUCTS.SUB_TITLE',
        valueGetter: this.localizeField.bind(this, 'subTitle'),
        field: 'subTitle',
      },
      { headerName: 'ADMIN.PRODUCTS.PREVIOUS_PRICE', field: 'prevPrice' },
      {
        headerName: 'ADMIN.PRODUCTS.CURRENT_PRICE',
        field: 'currentPrice',
      },
      {
        headerName: 'ADMIN.PRODUCTS.ACTIVE',
        field: 'active',
        valueGetter: this.valueGetter.bind(this, 'active'),
        filter: false,
        cellRendererFramework: AgGridToggleComponent,
        cellRendererParams: {
          statusField: 'active',
          deleteAttributeName: 'isDeleted',
          onToggleChange: (row, rowIndex) => componentRef.onRowToggleChange(row, rowIndex),
        },
      },
      {
        headerName: 'ADMIN.PRODUCTS.ACTIONS',
        field: 'action',
        sortable: false,
        filter: false,
        cellRendererFramework: AgGridButtonsComponent,
        cellRendererParams: {
          view: true,
          deleteAttributeName: 'isDeleted',
          clicked: (action, row, rowIndex) => componentRef.onRowActionClick(action, row, rowIndex),
        },
        rowDrag: true,
      },
    ];
  }
  private valueGetter = (field: string, param: any) => (param.data[field] ? 'Yes' : 'No');

  localizeField(field: string, params: ValueGetterParams): string {
    const lang = this.translateService.currentLang;
    return params.data[field][lang];
  }

  public updateOrders(products: Product[]): Observable<any> {
    this.entityUrl = this.httpUrlGenerator.entityResource('products', this.config.root, false);
    return this.http
      .put<any>(this.entityUrl + 'order', {
        products: products,
      })
      .pipe(
        map(
          (res: any) => {
            return res;
          },
          (res: any) => {
            return res;
          },
        ),
      );
  }

  public createColumnHideStrategy(): Map<string, number> {
    const newMap = new Map();
    newMap.set('subTitle', 1200);
    newMap.set('prevPrice', 950);
    newMap.set('currentPrice', 730);
    newMap.set('active', 560);
    return newMap;
  }

  public getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
}
