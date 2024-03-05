import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';

import { Query } from 'src/app/modules/contact_queries/query.model';
import { ContactQueriesService } from 'src/app/modules/contact_queries/query.service';
import { QueryDetailComponent } from './query-detail/query-detail.component';
import { AgGridService } from '../../shared/ag-grid/ag-grid.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnDestroy {
  public columnsHideStrategy: Map<string, number>;
  public queries: Query[] = [];
  public columnDefs: any[] = this.contactQueriesService.constructColumnDefs(this);
  public loading$: Observable<boolean>;
  public model = 'contact_queries';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private contactQueriesService: ContactQueriesService,
    private sharedService: SharedService,
    private agGridService: AgGridService,
    private socket: SocketService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) {
    this._unsubscribeAll = new Subject();
    contactQueriesService.entities$.subscribe((value) => (this.queries = value));
    this.loading$ = contactQueriesService.loading$;

    this.columnsHideStrategy = this.contactQueriesService.columnsHideStrategy;
    this.onModuleChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ionViewWillEnter = () => {
    this.getData();
    this.activatedRoute.paramMap
      .pipe(
        catchError((err) => {
          if (err.status === 400) {
            this.translateService.get('SNACKBAR.DETAILS_NOT_FOUND').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.error);
            });
            return err;
          }
        }),
      )
      .subscribe((params: ParamMap) => {
        const queryID = params.get('queryID');
        if (queryID) {
          this.contactQueriesService.getByKey(queryID).subscribe((contactQueryDetails) => {
            this.addEditItem(contactQueryDetails);
          });
        }
      });
  };

  public pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public getData(conditions: Object = {}, populate: string = '', limit: string = '10', skip: string = '0') {
    this.contactQueriesService.clearCache();
    this.contactQueriesService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public addEditItem(query: any = {}) {
    this.agGridService.afterDialogClosed(QueryDetailComponent, query).subscribe((response) => {
      if (response) {
        if (response._id) {
          // Update the query
          this.contactQueriesService.update(response).subscribe((result) => {
            this.translateService.get('SNACKBAR.UPDATED_QUERY').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        } else {
          // Save the query
          this.contactQueriesService.add(response).subscribe((result) => {
            this.translateService.get('SNACKBAR.ADDED_QUERY').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        }
      }
    });
  }

  public onRowActionClick(action, row, rowIndex): void {
    switch (action) {
      case 'view':
        this.addEditItem(row);
        break;
    }
  }

  private onModuleChanges() {
    this.socket.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'contact_queries') {
        this.getData();
      }
    });
  }

  onExport(event) {
    this.contactQueriesService.getWithPopulatedFields({}, '', null, '0', '-created_at').subscribe(() => {
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
