import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss'],
})
export class RoleDetailComponent {
  @ViewChild('name', { static: true }) nameElement: ElementRef;

  public editMode: boolean = false;
  public form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<RoleDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      _id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: [''],
      active: [],
    });

    if (data._id) {
      this.editMode = true;
      this.form.patchValue(data);
    }
  }

  close() {
    this.dialogRef.close();
  }

  public saveRole(form: UntypedFormGroup): void {
    if (form.invalid) return;
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
