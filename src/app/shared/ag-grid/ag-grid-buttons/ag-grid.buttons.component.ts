import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmDialogComponent } from 'nextsapien-component-lib';

@Component({
  selector: 'lib-ag-grid-buttons',
  templateUrl: './ag-grid.buttons.component.html',
  styleUrls: ['./ag-grid.buttons.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgGridButtonsComponent {
  public params: any;
  public hasReadProperty = false;

  constructor(private dialogService: MatDialog, private translateService: TranslateService) {}

  private agInit(params) {
    this.params = params;
    this.hasReadProperty = this.params.data && this.params.data?.read;
  }

  public clickButton = (action) => {
    if (action === 'delete' || action === 'permanentlyDelete') {
      const data = {
        title: 'ADMIN.AG_GRID.DELETION_CONFIRMATION',
        message: `${action === 'permanentlyDelete' ? 'ADMIN.AG_GRID.PERMANENT_DELETION' : 'ADMIN.AG_GRID.SOFT_DELETION'}`,
        cancelText: 'ADMIN.AG_GRID.CANCEL',
        confirmText: 'ADMIN.AG_GRID.DELETE',
      };
      this.translateService.get([data.title, data.message, data.cancelText, data.confirmText]).subscribe((translations) => {
        data.title = translations[data.title];
        data.message = translations[data.message];
        data.cancelText = translations[data.cancelText];
        data.confirmText = translations[data.confirmText];
        const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
          width: '270px',
          data,
        });
        dialogRef.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.params.clicked(action, this.params.data, this.params.rowIndex);
          }
        });
      });
    } else {
      this.params.clicked(action, this.params.data, this.params.rowIndex);
    }
  };
}
