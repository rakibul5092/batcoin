import { Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AuthService, fromPaginator, SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';

import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { AgGridService } from '../../shared/ag-grid/ag-grid.service';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserDetailsViewComponent } from './user-details-view/user-details-view.component';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnDestroy {
  public columnsHideStrategy: Map<string, number>;
  public users: User[] = [];
  public columnDefs: any[] = this.userService.constructColumnDefs(this);
  public showDeletedItems: boolean = false;
  public loading$: Observable<boolean>;
  public model = 'user';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private agGridService: AgGridService,
    private store: Store<fromPaginator.State>,
    private socket: SocketService,
    private authService: AuthService,
    private translateService: TranslateService,
  ) {
    this._unsubscribeAll = new Subject();
    userService.entities$.subscribe((value: any[]) => (this.users = this.showDeletedItems ? value.filter((item) => item.isDeleted) : value));
    this.loading$ = userService.loading$;

    this.columnsHideStrategy = this.userService.columnsHideStrategy;
    this.onModuleChanges();

    this.socket.newUserVerified.subscribe((verifiedUser) => {
      const index = this.users.findIndex((user) => user._id === verifiedUser._id);
      if (index >= 0) {
        this.users[index] = verifiedUser;
        this.users = [].concat(this.users); //  Just to trigger a change detection
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ionViewWillEnter = () => this.getData();

  public pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public getData(conditions: Object = {}, populate: string = '', limit: string = '10', skip: string = '0') {
    conditions = {
      isDeleted: this.showDeletedItems,
      _id: { $ne: JSON.parse(localStorage['user'])?._id },
    };
    this.userService.clearCache();
    this.userService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public addEditItem(userInfo: any = {}) {
    this.agGridService.afterDialogClosed(UserDetailComponent, userInfo).subscribe((user) => {
      if (user) {
        if (this.showDeletedItems) {
          this.toggleDeletedItems();
        }
        if (user._id) {
          // Update the user
          this.userService.update(user).subscribe((result) => {
            this.translateService.get('SNACKBAR.UPDATED_USER').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
            this.getData();
          });
        } else {
          // Save the user
          user.active = true;
          this.authService
            .register(user)
            .pipe(
              catchError((e) => {
                if (e.status === 422) {
                  this.translateService.get('SNACKBAR.ADD_USER_EMAIL_ERROR').subscribe((translation) => {
                    this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.error);
                  });
                  return e;
                }
              }),
            )
            .subscribe((result) => {
              this.translateService.get('SNACKBAR.ADDED_USER').subscribe((translation) => {
                this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
              });
              this.getData();
            });
        }
      }
    });
  }

  public toggleDeletedItems() {
    this.showDeletedItems = !this.showDeletedItems;
    this.getData();
  }

  public delete(user: User) {
    this.userService.delete(user).subscribe({
      next: () => {
        this.translateService.get('SNACKBAR.DELETED_USER').subscribe((translation) => {
          this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
        });
        this.getData();
      },
      error: (error) => {
        this.translateService.get(error.message).subscribe((translation) => {
          this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.error);
        });
      },
    });
  }

  public restore = (user: User) =>
    this.userService.update({ ...user, isDeleted: false }).subscribe(() => {
      this.translateService.get('SNACKBAR.RESTORED_USER').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });

  public viewUserDetails(user) {
    this.agGridService.afterDialogClosed(UserDetailsViewComponent, user).subscribe((res) => null);
  }

  public onRowActionClick(action, row, rowIndex): void {
    switch (action) {
      case 'edit':
        this.addEditItem(row);
        break;
      case 'restore':
        this.restore(row);
        break;
      case 'delete':
        this.delete(row);
        break;
      case 'permanentlyDelete':
        this.delete(row);
        break;
      case 'view':
        this.viewUserDetails(row);
    }
  }

  private onModuleChanges() {
    this.socket.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'user') {
        this.getData();
      }
    });
  }

  onExport(event) {
    this.userService.getWithPopulatedFields({}, '', null, '0', '-created_at').subscribe(() => {
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
