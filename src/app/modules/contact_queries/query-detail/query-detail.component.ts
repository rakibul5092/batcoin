import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-query-detail',
  templateUrl: './query-detail.component.html',
  styleUrls: ['./query-detail.component.scss'],
})
export class QueryDetailComponent {
  @ViewChild('name', { static: true }) nameElement: ElementRef;

  public editMode: boolean = false;

  public form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<QueryDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      _id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      message: [{ value: '', disabled: true }, Validators.required],
    });

    if (data._id) {
      this.editMode = true;
      this.form.patchValue(data);
    }
    this.form.disable();
  }

  public close() {
    this.dialogRef.close();
  }

  public saveQuery(form: UntypedFormGroup) {
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
