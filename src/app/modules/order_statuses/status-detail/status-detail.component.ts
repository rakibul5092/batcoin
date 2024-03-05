import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-status-detail',
  templateUrl: './status-detail.component.html',
  styleUrls: ['./status-detail.component.scss'],
})
export class StatusDetailComponent {
  @ViewChild('name', { static: true }) nameElement: ElementRef;

  public editMode: boolean = false;
  public form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<StatusDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      _id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: [''],
      active: [],
      default_status: [],
    });

    if (data._id) {
      this.editMode = true;
      this.form.patchValue(data);
    }
  }

  public close() {
    this.dialogRef.close();
  }

  public saveStatus(form: UntypedFormGroup) {
    const value = form.getRawValue();
    if (!this.editMode) {
      delete value._id;
    }
    this.dialogRef.close(value);
  }

  private setFocus() {
    this.nameElement.nativeElement.focus();
  }
}
