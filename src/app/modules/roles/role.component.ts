import { Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';

import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { AgGridService } from '../../shared/ag-grid/ag-grid.service';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RoleDetailsViewComponent } from './role-details-view/role-details-view.component';
import { Role } from './role.model';
import { RoleService } from './role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnDestroy {
  public roles: Role[] = [];
  public showDeletedItems: boolean = false;
  public columnDefs: any[] = this.roleService.constructColumnDefs(this);
  public loading$: Observable<boolean>;
  public model = 'user_roles';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private roleService: RoleService,
    private sharedService: SharedService,
    private agGridService: AgGridService,
    private socket: SocketService,
    private translateService: TranslateService,
  ) {
    this._unsubscribeAll = new Subject();
    roleService.entities$.subscribe((value) => (this.roles = value));
    this.loading$ = roleService.loading$;

    this.onModuleChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ionViewWillEnter = () => this.getData();

  public pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public getData(conditions: Object = {}, populate: string = '', limit: string = '10', skip: string = '0') {
    this.roleService.clearCache();
    this.roleService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public addEditItem(roleInfo: any = {}) {
    this.agGridService.afterDialogClosed(RoleDetailComponent, roleInfo).subscribe((role) => {
      if (role) {
        if (role._id) {
          // Update the role
          this.roleService.update(role).subscribe((result) => {
            this.translateService.get('SNACKBAR.UPDATED_ROLE').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        } else {
          // Save the role
          this.roleService.add(role).subscribe((result) => {
            this.translateService.get('SNACKBAR.ADDED_ROLE').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          });
        }
      }
    });
  }

  public delete(role: Role) {
    this.roleService.delete(role).subscribe(() => {
      this.translateService.get('SNACKBAR.DELETED_ROLE').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public viewRoleDetails(data) {
    this.agGridService.afterDialogClosed(RoleDetailsViewComponent, data).subscribe((res) => null);
  }

  public toggleDeletedItems() {
    this.showDeletedItems = !this.showDeletedItems;
    this.getData();
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
        this.viewRoleDetails(row);
        break;
    }
  }

  private onModuleChanges() {
    this.socket.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'roles') {
        this.getData();
      }
    });
  }

  onExport(event) {
    this.roleService.getWithPopulatedFields({}, '', null, '0', '-created_at').subscribe(() => {
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
