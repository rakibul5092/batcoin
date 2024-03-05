import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AgGridService {
  constructor(public dialogService: MatDialog) {}

  public afterDialogClosed(component: any, date: any, width?) {
    return this.dialogService
      .open(component, {
        data: date,
        width: width || '75%',
        panelClass: 'modal-pane',
      })
      .afterClosed();
  }
}
