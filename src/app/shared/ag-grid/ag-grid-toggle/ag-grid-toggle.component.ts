import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ag-grid-toggle',
  templateUrl: './ag-grid-toggle.component.html',
  styleUrls: ['./ag-grid-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgGridToggleComponent {
  public params: any;

  private agInit = (params): void => (this.params = params);

  public onToggleChange = (): void => this.params.onToggleChange(this.params.data, this.params.rowIndex);
}
