import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role-details-view',
  templateUrl: './role-details-view.component.html',
  styleUrls: ['./role-details-view.component.scss'],
})
export class RoleDetailsViewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<RoleDetailsViewComponent>) {}
}
