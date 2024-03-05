import { Component, OnDestroy } from '@angular/core';

import { SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Order } from 'src/app/modules/orders/order.model';
import { OrderService } from 'src/app/modules/orders/order.service';
import { AgGridService } from '../../shared/ag-grid/ag-grid.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { UpdateStatusComponent } from './update-status/update-status.component';

import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnDestroy {
  public columnsHideStrategy: Map<string, number>;
  public orders: Order[] = [];
  public columnDefs: any[] = this.orderService.constructColumnDefs(this);
  public loading$: Observable<boolean>;
  public model = 'order_status';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private orderService: OrderService,
    private sharedService: SharedService,
    private agGridService: AgGridService,
    private socket: SocketService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) {
    this._unsubscribeAll = new Subject();
    orderService.entities$.subscribe((value) => (this.orders = value));
    this.loading$ = orderService.loading$;

    this.columnsHideStrategy = this.orderService.columnsHideStrategy;
    this.onModuleChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ionViewWillEnter = () => {
    this.getData();
    this.activatedRoute.paramMap.subscribe((params) => {
      const orderID = params.get('orderID');
      if (orderID) {
        this.orderService.getByKey(orderID).subscribe((orderDetails) => {
          this.addEditItem(orderDetails);
        });
      }
    });
  };

  public pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public getData(conditions: Object = {}, populate: string = 'order_status', limit: string = '10', skip: string = '0') {
    this.orderService.clearCache();
    this.orderService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public addEditStatus(order: any = {}) {
    this.agGridService.afterDialogClosed(UpdateStatusComponent, order).subscribe((response) => {
      if (response) {
        this.orderService.update(response).subscribe((result) => {
          this.translateService.get('SNACKBAR.UPDATED_ORDER').subscribe((translation) => {
            this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
          });
        });
      }
    });
  }

  public addEditItem(order: any = {}) {
    this.agGridService.afterDialogClosed(OrderDetailComponent, order).subscribe((response) => {
      if (response) {
        if (response._id) {
          // Update the order
          this.orderService.update(response).subscribe((result) => {
            this.translateService.get('SNACKBAR.UPDATED_ORDER').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        } else {
          // Save the order
          this.orderService.add(response).subscribe((result) => {
            this.translateService.get('SNACKBAR.ADDED_ORDER').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        }
      }
    });
  }

  public delete(order: Order) {
    this.orderService.delete(order).subscribe(() => {
      this.translateService.get('SNACKBAR.DELETED_ORDER').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public onRowActionClick(action, row, rowIndex): void {
    switch (action) {
      case 'edit':
        this.addEditStatus(row);
        break;
      case 'view':
        this.addEditItem(row);
        break;
      case 'delete':
        this.delete(row);
        break;
    }
  }

  public onRowClicked = (e) => this.onRowActionClick('view', e.row, e.rowIndex);

  private onModuleChanges() {
    this.socket.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'orders') {
        this.getData();
      }
    });
  }

  onExport(event) {
    this.orderService.getWithPopulatedFields({}, '', null, '0', '-created_at').subscribe(() => {
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
