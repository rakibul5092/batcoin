import { Injectable } from '@angular/core';

import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { map } from 'rxjs/operators';
import { AgGridButtonsComponent } from '../../shared/ag-grid/ag-grid-buttons/ag-grid.buttons.component';
import { User } from './user.model';

import { PopulatedEntityCollectionServiceBase, PopulateEntityDataServiceFactory, UserRoleCellRenderComponent } from 'nextsapien-component-lib';

@Injectable({
  providedIn: 'root',
})
export class UserService extends PopulatedEntityCollectionServiceBase<User> {
  public columnsHideStrategy = new Map<string, number>([
    ['last_name', 1000],
    ['email', 800],
  ]);

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, populateEntityDataServiceFactory: PopulateEntityDataServiceFactory) {
    super('users', serviceElementsFactory, populateEntityDataServiceFactory);
  }

  public constructColumnDefs(componentRef): any[] {
    return [
      { headerName: 'ADMIN.USERS.FIRST_NAME', field: 'first_name' },
      { headerName: 'ADMIN.USERS.LAST_NAME', field: 'last_name' },
      {
        headerName: 'ADMIN.USERS.ROLE',
        field: 'role.name',
        cellRendererFramework: UserRoleCellRenderComponent,
        autoHeight: true,
      },
      { headerName: 'ADMIN.USERS.EMAIL', field: 'email' },
      {
        headerName: 'ADMIN.USERS.ACTIONS',
        field: 'action',
        sortable: false,
        filter: false,
        cellRendererFramework: AgGridButtonsComponent,
        cellRendererParams: {
          view: true,
          deleteAttributeName: 'isDeleted',
          clicked: (action, row, rowIndex) => componentRef.onRowActionClick(action, row, rowIndex),
        },
      },
    ];
  }

  public checkIfEmailExists(email: string) {
    return this.http.get<any>(this.entityUrl + `email_exists?email=${email}`).pipe(map((res: { email_exists: boolean }) => res.email_exists));
  }
}
