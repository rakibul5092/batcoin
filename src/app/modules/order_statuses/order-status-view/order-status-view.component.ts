import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-status-view',
  templateUrl: './order-status-view.component.html',
  styleUrls: ['./order-status-view.component.scss'],
})
export class OrderStatusViewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<OrderStatusViewComponent>) {}
}
