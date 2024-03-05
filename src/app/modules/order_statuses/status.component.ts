import { Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';

import { Status } from 'src/app/modules/order_statuses/status.model';
import { StatusService } from 'src/app/modules/order_statuses/status.service';

import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { AgGridService } from '../../shared/ag-grid/ag-grid.service';
import { OrderStatusViewComponent } from './order-status-view/order-status-view.component';
import { StatusDetailComponent } from './status-detail/status-detail.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnDestroy {
  public statuses: Status[] = [];
  public columnDefs: any[] = this.statuseservice.constructColumnDefs(this);
  public loading$: Observable<boolean>;
  public model = 'order_status';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private statuseservice: StatusService,
    private sharedService: SharedService,
    private agGridService: AgGridService,
    private socket: SocketService,
    private translateService: TranslateService,
  ) {
    this._unsubscribeAll = new Subject();
    statuseservice.entities$.subscribe((value) => (this.statuses = value));
    this.loading$ = statuseservice.loading$;

    this.onModuleChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ionViewWillEnter = () => this.getData();

  public pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public getData(conditions: Object = {}, populate: string = '', limit: string = '10', skip: string = '0') {
    this.statuseservice.clearCache();
    this.statuseservice.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public addEditItem(statusInfo: any = {}) {
    this.agGridService.afterDialogClosed(StatusDetailComponent, statusInfo).subscribe((status) => {
      if (status) {
        if (status._id) {
          // Update the status
          this.statuseservice.update(status).subscribe((result) => {
            this.translateService.get('SNACKBAR.UPDATED_ORDER_STATUS').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        } else {
          // Save the status
          this.statuseservice.add(status).subscribe((result) => {
            this.translateService.get('SNACKBAR.ADDED_ORDER_STATUS').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        }
      }
    });
  }

  public viewOrderStatus(data) {
    this.agGridService.afterDialogClosed(OrderStatusViewComponent, data).subscribe((res) => null);
  }

  public delete(status: Status) {
    this.statuseservice.delete(status).subscribe(() => {
      this.translateService.get('SNACKBAR.DELETED_ORDER_STATUS').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public onRowActionClick(action, row, rowIndex): void {
    switch (action) {
      case 'edit':
        this.addEditItem(row);
        break;
      case 'delete':
        this.delete(row);
        break;
      case 'permanentlyDelete':
        this.delete(row);
        break;
      case 'view':
        this.viewOrderStatus(row);
        break;
    }
  }

  private onModuleChanges() {
    this.socket.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'order_status') {
        this.getData();
      }
    });
  }

  onExport(event) {
    this.statuseservice.getWithPopulatedFields({}, '', null, '0', '-created_at').subscribe(() => {
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
