import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';

import { Role } from 'src/app/modules/roles/role.model';
import { RoleService } from 'src/app/modules/roles/role.service';
import { EmailExistsValidator } from './user-detail-email-validator';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent {
  @ViewChild('name', { static: true }) nameElement: ElementRef;

  public editMode: boolean = false;
  public form: UntypedFormGroup;

  public roles$: Observable<Role[]>;
  public roleLoading = false;
  public roleInput$ = new Subject<string>();
  public loading$: Observable<boolean>;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<UserDetailComponent>,
    private roleService: RoleService,
    private readonly emailExistsValidator: EmailExistsValidator,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      _id: [{ value: '', disabled: true }],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: new UntypedFormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailExistsValidator.emailExists(data?.email)],
        updateOn: 'blur',
      }),
      role: [null, Validators.required],
      active: [true],
    });

    if (data._id) {
      this.editMode = true;
      this.form.patchValue(data);
    }

    this.getRoles();
  }

  public close() {
    this.dialogRef.close();
  }

  public saveUser(form: UntypedFormGroup): void {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const value = form.getRawValue();
    if (!this.editMode) {
      delete value._id;
    }
    value.role = value.role._id;
    this.dialogRef.close(value);
  }

  private setFocus() {
    this.nameElement.nativeElement.focus();
  }

  public getRoles() {
    this.roles$ = this.roleInput$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.roleLoading = true)),
      switchMap((term) =>
        this.roleService
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
            tap(() => (this.roleLoading = false)),
          ),
      ),
    );
  }
}
