import { Component, ViewChild } from '@angular/core';
import { FormGroupDirective, NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { ContactQueriesService } from 'src/app/modules/contact_queries/query.service';

import { TranslateService } from '@ngx-translate/core';
import { SNACKBARTYPE } from 'nextsapien-component-lib';
import { SharedService } from 'src/app/shared/shared.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.scss'],
})
export class QueryFormComponent {
  @ViewChild('queryForm') formGroupDirective: FormGroupDirective;

  public disableTooltips: boolean;
  public form = this.fb.group({
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    subject: [null, Validators.required],
    message: [null, Validators.required],
  });
  public matcher = new MyErrorStateMatcher();

  constructor(
    private fb: UntypedFormBuilder,
    private contactQueriesService: ContactQueriesService,
    private sharedService: SharedService,
    private translateService: TranslateService,
  ) {
    this.sharedService.cmsSettingsObs.subscribe((cms) => {
      this.disableTooltips = !cms?.disableTooltips;
    });
  }

  public onSubmit(form: UntypedFormGroup) {
    const { value, valid, touched } = form;

    if (valid && touched) {
      this.contactQueriesService.add(value).subscribe((response) => {
        this.translateService.get('SNACKBAR.QUERY_SUBMITTED').subscribe((translation) => {
          this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
        });
      });
      setTimeout(() => this.formGroupDirective.resetForm(), 0);
    }
  }
}
