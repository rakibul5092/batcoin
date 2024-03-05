import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Order } from './order.model';

import { DefaultDataServiceConfig, EntityCollectionServiceElementsFactory, HttpUrlGenerator } from '@ngrx/data';

import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory } from 'nextsapien-component-lib';
import { AgGridButtonsComponent } from '../../shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends PopulatedEntityCollectionServiceBase<Order> {
  public columnsHideStrategy = new Map<string, number>([
    ['last_name', 1200],
    ['email', 1000],
    ['order_status.name', 730],
    ['cart.total_price', 560],
  ]);

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    populateEntityDataServiceFactory: PopulateEntityDataServiceFactory,
    protected override httpUrlGenerator: HttpUrlGenerator,
    protected override http: HttpClient,
    protected override config: DefaultDataServiceConfig,
  ) {
    super('orders', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  public createStripePayment(user, token, shipmentInfo): Observable<any> {
    this.entityUrl = this.httpUrlGenerator.entityResource('orders', this.config.root, false);
    return this.http
      .post<any>(this.entityUrl + 'stripe-payment', {
        user: user,
        shipment: shipmentInfo,
        token: token,
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

  public constructColumnDefs(componentRef): any[] {
    return [
      { headerName: 'ADMIN.ORDERS.FIRST_NAME', field: 'first_name' },
      { headerName: 'ADMIN.ORDERS.LAST_NAME', field: 'last_name' },
      { headerName: 'ADMIN.ORDERS.EMAIL', field: 'email' },
      {
        headerName: 'ADMIN.ORDERS.CART_TOTAL_PRICE',
        field: 'cart.total_price',
      },
      { headerName: 'ADMIN.ORDERS.STATUS', field: 'order_status.name' },
      {
        headerName: 'ADMIN.ORDERS.ACTIONS',
        field: 'action',
        sortable: false,
        filter: false,
        cellRendererFramework: AgGridButtonsComponent,
        cellRendererParams: {
          view: true,
          clicked: (action, row, rowIndex) => componentRef.onRowActionClick(action, row, rowIndex),
        },
      },
    ];
  }
}
