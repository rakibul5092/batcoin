import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ag-grid-markread',
  templateUrl: './ag-grid-markread.component.html',
  styleUrls: ['./ag-grid-markread.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgGridMarkreadComponent {
  public params: any;

  constructor(private dialogService: MatDialog) {}

  private agInit = (params): void => (this.params = params);

  public clickButton = (action: string) => {
    this.params.clicked(action, this.params.data, this.params.rowIndex);
  };
}
