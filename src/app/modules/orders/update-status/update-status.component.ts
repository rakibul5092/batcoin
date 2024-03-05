import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';

import { Status } from 'src/app/modules/order_statuses/status.model';
import { StatusService } from 'src/app/modules/order_statuses/status.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss'],
})
export class UpdateStatusComponent {
  public statuses$: Observable<Status[]>;
  public statusLoading = false;
  public statusInput$ = new Subject<string>();

  public form: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<UpdateStatusComponent>,
    private statusesService: StatusService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      order_status: [null, Validators.required],
    });

    this.form.patchValue(data);
    this.getStatus();
  }

  public close() {
    this.dialogRef.close();
  }

  public saveStatus(form: UntypedFormGroup) {
    const value = form.getRawValue();
    const updatedOrder = {
      ...this.data,
      order_status: value.order_status._id,
    };
    this.dialogRef.close(updatedOrder);
  }

  private getStatus() {
    this.statuses$ = this.statusInput$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.statusLoading = true)),
      switchMap((term) =>
        this.statusesService
          .getWithPopulatedFields(
            {
              name: { $regex: '(?i).*' + term + '.*' },
              active: true,
            },
            '',
            '10',
          )
          .pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.statusLoading = false)),
          ),
      ),
    );
  }
}
