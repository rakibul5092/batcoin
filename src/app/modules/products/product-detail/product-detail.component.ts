import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { ConfirmDialogComponent, DynamicTranslateService, FileManagerService, Language, SharedService, SNACKBARTYPE, Translations } from 'nextsapien-component-lib';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AgGridService } from 'src/app/shared/ag-grid/ag-grid.service';
import { SharedService as SharedAppService } from 'src/app/shared/shared.service';
import { AddImageViaUrlComponent } from '../add-image-via-url/add-image-via-url.component';
import { IProgressiveImage } from '../product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imageUploadSection') ImageUploadSection: ElementRef;

  public uploadLoading: boolean = false;
  public editMode: boolean = false;
  public form: UntypedFormGroup;
  private formValuesClone: object;
  public progressiveImages: IProgressiveImage[];
  public isSubmitted: boolean = false;
  isDeleteAllImages: boolean = false;

  public get categoryControl(): AbstractControl {
    return this.form.controls['category'];
  }
  parcelValidations: any = { min: 1, max: 2000 };
  private languageSubscription: Subscription;

  public smallScreen: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private fileManager: FileManagerService,
    public dialogService: MatDialog,
    private translateService: TranslateService,
    private readonly dynmaicTanslationService: DynamicTranslateService,
    private sharedAppService: SharedAppService,
    private agGridService: AgGridService,
  ) {
    this.translateService.use(localStorage.getItem('language') || 'en');
    this.formCreation();
    this.editChecked(data);
    this.modalConfig();
    this.categoryControl.valueChanges.subscribe((res) => {
      if (res.length > 0 && res[0] === ' ')
        this.categoryControl.patchValue((res || '').trim(), {
          emitEvent: false,
        });
    });
  }

  ionViewWillEnter = () => (this.isDeleteAllImages = false);

  ngOnInit() {
    this.formValuesClone = cloneDeep(this.form.getRawValue());
    this.checkSmallScreen(500);
  }
  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.sharedService.createIntersectionObserver(this.ImageUploadSection.nativeElement, ([e]) => {
      // 200 is less than mid way through the screen so is top half. Did that to avoid division
      e.target.classList.toggle('stuck', e.intersectionRatio < 1 && e.boundingClientRect.top < 200);
    });
  }

  public close() {
    if (!isEqual(this.formValuesClone, this.form.getRawValue())) {
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
              this.onCancel();
              this.dialogRef.close();
            }
          });
        });
    } else {
      this.dialogRef.close();
    }
  }

  public onCancel() {
    if (this.progressiveImages && this.progressiveImages.length > 0) {
      const deletedFiles = [];
      this.progressiveImages.forEach((image) => {
        if ((!this.editMode && image.url) || (this.editMode && image.url && image.transient)) {
          deletedFiles.push({ filename: image.url });
        }
      });
      if (deletedFiles.length > 0) {
        this.fileManager.deleteFileBulkFromAWS(deletedFiles).subscribe();
      }
    }
  }

  public saveProduct(form: UntypedFormGroup) {
    if (form.invalid) return;
    // translating title, subtitle and description fiels and saving to database
    if (this.validProductGallery()) {
      const { languages, observable } = this.getTranslatedData(); // Translation API observable with modified response
      this.languageSubscription = observable.subscribe((res) => {
        const rawValue = form.getRawValue();

        const title = {
          // Adding title object for 3 different language
          [languages[0]]: res[0][0].translatedText,
          [languages[1]]: res[1][0].translatedText,
          [this.translateService.currentLang]: rawValue.title,
        };
        const subTitle = {
          // Adding sub title object for 3 different language
          [languages[0]]: res[0][1].translatedText,
          [languages[1]]: res[1][1].translatedText,
          [this.translateService.currentLang]: rawValue.subTitle,
        };
        const category = {
          // Adding category object for 3 different language
          [languages[0]]: res[0][2].translatedText,
          [languages[1]]: res[1][2].translatedText,
          [this.translateService.currentLang]: rawValue.category,
        };
        const description = {
          // Adding description object for 3 different language
          [languages[0]]: res[0][3].translatedText,
          [languages[1]]: res[1][3].translatedText,
          [this.translateService.currentLang]: rawValue.description,
        };

        const value = {
          ...form.getRawValue(),
          title,
          subTitle,
          category,
          description,
        }; // Added title, sub title, description object with existing form value

        if (!this.editMode) {
          delete value._id;
        }
        this.dialogRef.close({
          value,
          progressiveImages: this.progressiveImages,
        });
      });
    }
  }

  public confirmBulkImagesDeleteAction() {
    if (this.isDeleteAllImages) this.isDeleteAllImages = false;
    else
      this.translateService.get(['ADMIN.PRODUCTS.PLEASE_CONFIRM', 'ADMIN.PRODUCTS.DELETE_ALL_IMAGES', 'ADMIN.PRODUCTS.YES', 'ADMIN.PRODUCTS.NO']).subscribe((t) => {
        const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
          data: {
            title: t['ADMIN.PRODUCTS.PLEASE_CONFIRM'],
            message: t['ADMIN.PRODUCTS.DELETE_ALL_IMAGES'],
            confirmText: t['ADMIN.PRODUCTS.YES'],
            cancelText: t['ADMIN.PRODUCTS.NO'],
          },
          width: '250px',
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.progressiveImages.map((image) => (image.deleted = true));
            this.isDeleteAllImages = true;
          }
        });
      });
  }

  public addNewImage(image: any) {
    (this.getImagesArr() as UntypedFormArray).push(
      this.fb.group({
        url: [{ value: image.url, disabled: true }, Validators.required],
      }),
    );
    this.form.get('progressiveImages').markAsTouched();
  }

  public onFileUpload(image) {
    this.addNewImage(image);
    this.progressiveImages.push({
      url: image.url,
      label: 'Inactive',
      active: false,
      transient: true,
    });
    this.isDeleteAllImages = false;
  }

  private editChecked(data: any): void {
    if (data._id) {
      this.editMode = true;
      const lang = this.translateService.currentLang;
      const mutatedData = {
        ...data,
        title: data.title[lang],
        subTitle: data.subTitle[lang],
        category: data.category[lang] ? data.category[lang] : data.category,
        description: data.description[lang],
      };
      this.form.patchValue(mutatedData);
      if (data.progressiveImages.length > 0) {
        this.progressiveImages = [];
        data.progressiveImages.forEach((image) => {
          this.progressiveImages.push({ ...image });
          this.addNewImage(image);
        });
      }
    }
  }

  private formCreation() {
    this.form = this.fb.group({
      _id: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      slug: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: [{ value: '', disabled: true }, Validators.required],
      backPath: [{ value: '', disabled: true }, Validators.required],
      description: ['', Validators.required],
      prevPrice: [''],
      currentPrice: ['', [Validators.required, this.validateCurrAndPrevPrice.bind(this)]],
      images: this.fb.array([]),
      activeImages: this.fb.array([]),
      progressiveImages: this.fb.array([]),
      active: [],
      parcel: this.fb.group({
        pLength: [1, [Validators.required, Validators.min(this.parcelValidations.min), Validators.max(this.parcelValidations.max)]],
        width: [1, [Validators.required, Validators.min(this.parcelValidations.min), Validators.max(this.parcelValidations.max)]],
        height: [1, [Validators.required, Validators.min(this.parcelValidations.min), Validators.max(this.parcelValidations.max)]],
        weight: [1, [Validators.required, Validators.min(this.parcelValidations.min), Validators.max(this.parcelValidations.max)]],
      }),
    });
  }

  private modalConfig() {
    this.dialogRef.disableClose = true;
    //  subscribe to backdropclick observable of dialogRef
    this.dialogRef.backdropClick().subscribe((event) => {
      if (this.uploadLoading) return;
      this.close();
    });
  }

  public onUpdateLoading(event) {
    this.uploadLoading = event;
  }

  public getImagesArr() {
    return this.form.get('progressiveImages')['controls'];
  }

  private validProductGallery(): boolean {
    const currentGallerySize = this.getCurrentGallerySize();
    if (currentGallerySize === 0 && this.isDeleteAllImages != true) {
      this.translateService.get('SNACKBAR.NO_IMAGES').subscribe((t) => this.sharedAppService.openSnackBar(t, '', SNACKBARTYPE.error));
      return false;
    }
    if (currentGallerySize > 8) {
      this.translateService.get('SNACKBAR.UPLOAD_ONLY_8').subscribe((t) => this.sharedAppService.openSnackBar(t, '', SNACKBARTYPE.error));
      return false;
    }

    const message = [];
    let active = 0;
    let front = 0;
    let back = 0;
    this.progressiveImages.forEach((image) => {
      if (!image.deleted) {
        active = image.label === 'active' ? (active += 1) : active;
        front = image.label === 'imageUrl' ? (front += 1) : front;
        back = image.label === 'backPath' ? (back += 1) : back;
      }
    });
    if (active === 0) {
      this.translateService.get('ACTIVE_IMAGE').subscribe((t) => message.push(t));
    }
    if (front === 0) {
      this.translateService.get('FRONT_IMAGE').subscribe((t) => message.push(t));
    }
    if (back === 0) {
      this.translateService.get('BACK_IMAGE').subscribe((t) => message.push(t));
    }
    if (message.length != 0) {
      this.translateService.get(['SNACKBAR.MARK_AT_LEAST', 'AND']).subscribe((t) => {
        this.sharedAppService.openSnackBar(`${t['SNACKBAR.MARK_AT_LEAST']} ${message.join(t['AND'])}`, '', SNACKBARTYPE.error);
      });
      return false;
    }
    return true;
  }

  public getCurrentGallerySize(): number {
    if (!this.progressiveImages) {
      this.progressiveImages = [];
      return 0;
    }
    const notDeletedImages = this.progressiveImages.filter((image) => !image.deleted);
    return notDeletedImages.length;
  }

  public parcelValidate(control, error): boolean {
    const parcel = this.form.controls['parcel'] as UntypedFormGroup;
    return parcel.controls[control].errors && parcel.controls[control].errors[error];
  }

  // Dynamic translation function
  private getTranslatedData(): {
    languages: string[];
    observable: Observable<[Translations[], Translations[]]>;
  } {
    const languages: string[] = Object.keys(Language).filter(
      // Filtered unselected languages
      (lang) => lang !== this.translateService.currentLang,
    );
    const textData = [
      // Getting raw data from title, subtitle and description fields
      this.form.get('title').value,
      this.form.get('subTitle').value,
      this.form.get('category').value,
      this.form.get('description').value,
    ];

    const observable = combineLatest([
      // Combined 2 api request observable in one observable
      this.dynmaicTanslationService.translate(textData, languages[0]),
      this.dynmaicTanslationService.translate(textData, languages[1]),
    ]).pipe(first());

    return { languages, observable };
  }

  private isValidPricing(currentPrice: number, prevPrice: number): boolean {
    if (prevPrice || prevPrice === 0) return currentPrice <= prevPrice;
    else return currentPrice >= 0;
  }

  public validateCurrAndPrevPrice(control: UntypedFormControl): ValidationErrors | null {
    const prevPrice = this.form ? this.form.get('prevPrice').value : 0;
    return this.isValidPricing(control.value, prevPrice) ? null : { invalidPricing: true };
  }

  get currentPriceError(): string {
    const currentPrice = this.form.get('currentPrice');
    const previousPrice = this.form.get('prevPrice');
    return currentPrice.hasError('required')
      ? 'REQUIRED'
      : !this.isValidPricing(currentPrice.value, previousPrice.value)
      ? 'ADMIN.PRODUCTS.CURRENT_PRICE_NOT_MORE_THAN_PREV_PRICE'
      : '';
  }

  public checkSmallScreen(smallScreenWidth) {
    this.smallScreen = window.innerWidth <= smallScreenWidth;
  }

  public openUrlBox() {
    this.agGridService.afterDialogClosed(AddImageViaUrlComponent, null).subscribe((res) => {
      if (res) {
        this.onFileUpload(res);
      }
    });
  }
}
