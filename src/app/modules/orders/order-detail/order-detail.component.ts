import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
  @ViewChild('first_name', { static: true }) nameElement: ElementRef;

  public editMode: boolean = false;

  public form: UntypedFormGroup;
  public cart: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<OrderDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      _id: [{ value: '', disabled: true }],
      payment_id: [{ value: '', disabled: true }],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      address_line_1: ['', Validators.required],
      address_line_2: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      // cart: this.fb.group({
      //   total_price: ['', Validators.required],
      // })
    });

    this.cart = this.fb.group({
      total_price: ['', Validators.required],
    });

    if (data._id) {
      this.editMode = true;
      this.form.patchValue(data);
      this.cart.patchValue(data.cart);
    }
    this.form.disable();
    this.cart.disable();
  }

  close() {
    this.dialogRef.close();
  }

  public saveOrder(form: UntypedFormGroup) {
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
