import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details-view',
  templateUrl: './user-details-view.component.html',
  styleUrls: ['./user-details-view.component.scss'],
})
export class UserDetailsViewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<UserDetailsViewComponent>) {}
}
