import { Component, Inject, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DefaultDataServiceConfig } from '@ngrx/data';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, HttpUtilService, SharedService, SNACKBARTYPE } from 'nextsapien-component-lib';
import { Subscription } from 'rxjs';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-image-via-url',
  templateUrl: './add-image-via-url.component.html',
  styleUrls: ['./add-image-via-url.component.scss'],
})
export class AddImageViaUrlComponent implements OnDestroy {
  private subs: Subscription = new Subscription();
  public form: UntypedFormGroup;
  public imageLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    public dialogService: MatDialog,
    private translateService: TranslateService,
    private productService: ProductService,
    private config: DefaultDataServiceConfig,
    private httpUtilService: HttpUtilService,
  ) {
    this.formCreation();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private formCreation() {
    this.form = this.fb.group({
      url: ['', [Validators.required]],
    });
  }

  private createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        const file = {
          name: Math.random().toString(36).slice(2, 7),
          type: image['type'],
          size: image['size'],
          webpConvert: false,
          content: reader.result.toString().split(',')[1],
        };

        this.httpUtilService
          .postRequest(this.config.root + '/s3/upload', {
            files: [file],
          })
          .subscribe((response) => {
            this.imageLoading = false;
            this.translateService.get('SNACKBAR.FILE_UPLOAD_SUCCESSFUL').subscribe((translation) => this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success));
            this.dialogRef.close(response[0]);
          });
      },
      false,
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  public close() {
    if (!this.imageLoading) {
      if (this.form.value.url) {
        this.subs.add(
          this.translateService
            .get(['ADMIN.PRODUCTS.PLEASE_CONFIRM', 'ADMIN.PRODUCTS.DO_YOU_WANT_TO_DISCARD_THE_CHANGES_YOUVE_MADE', 'ADMIN.PRODUCTS.YES', 'ADMIN.PRODUCTS.NO'])
            .subscribe((t) => {
              const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
                data: {
                  title: t['ADMIN.PRODUCTS.PLEASE_CONFIRM'],
                  message: t['ADMIN.PRODUCTS.DO_YOU_WANT_TO_DISCARD_THE_CHANGES_YOUVE_MADE'],
                  confirmText: t['ADMIN.PRODUCTS.YES'],
                  cancelText: t['ADMIN.PRODUCTS.NO'],
                },
                width: '250px',
              });
              dialogRef.afterClosed().subscribe((confirmed) => {
                if (confirmed) {
                  this.dialogRef.close();
                }
              });
            }),
        );
      } else {
        this.dialogRef.close();
      }
    }
  }

  public downloadImage() {
    if (this.form.valid) {
      this.imageLoading = true;
      this.subs.add(
        this.productService.getImage(this.form.value.url).subscribe({
          next: (result) => {
            this.createImageFromBlob(result);
          },
          error: () => {
            this.imageLoading = false;
            this.translateService.get('ADMIN.PRODUCTS.INVALID_URL').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.error);
            });
          },
        }),
      );
    } else {
      this.form.markAllAsTouched();
    }
  }
}
