import { Component, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicTranslateService, FileManagerService, Language, SNACKBARTYPE, SocketService, Translations } from 'nextsapien-component-lib';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from '../../../environments/environment';
import { Cms } from './cms.model';
import { CmsService } from './cms.service';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss'],
})
export class CmsComponent implements OnDestroy {
  public cms: Cms[] = [];
  public loading$: Observable<boolean>;
  private _unsubscribeAll: Subject<any>;

  public cmsForm: UntypedFormGroup;

  public isUploading: boolean = false;
  public disabledLogo: boolean = false;
  public disabledFavIcon: boolean = false;
  public deletedImages: any[] = [];
  private translationSubscription: Subscription;

  constructor(
    private cmsService: CmsService,
    private sharedService: SharedService,
    private socket: SocketService,
    private fb: UntypedFormBuilder,
    private translate: TranslateService,
    private fileManagerService: FileManagerService,
    private dynmaicTanslationService: DynamicTranslateService,
  ) {
    this.formCreation();
    this._unsubscribeAll = new Subject();
    cmsService.entities$.subscribe((value: Cms[]) => {
      this.cms = value;
      if (this.cms.length > 0) {
        const lang = this.translate.currentLang;
        const mutatedData = {
          ...this.cms[0],
          cookiesContent: this.cms[0].cookiesContent ? this.cms[0].cookiesContent[lang] : '',
        };
        this.cmsForm.patchValue(mutatedData);
      }
    });

    this.loading$ = cmsService.loading$;
    this.onModuleChanges();
    // Register translation languages
    translate.addLangs(['en', 'fr', 'es']);
    // Set default language
    translate.setDefaultLang('en');
    // Check for language in localStorage
    localStorage.getItem('language') ? translate.use(localStorage.getItem('language')) : translate.use('en');
  }

  ionViewWillEnter = () => this.getData();

  public pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public getData(conditions: Object = {}, populate: string = '', limit: string = '10', skip: string = '0') {
    this.cmsService.clearCache();
    this.cmsService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public addEditItem(): void {
    const cmsRawValue = this.cmsForm.getRawValue();
    if (this.isShippingChecked()) {
      cmsRawValue.shipping = cmsRawValue.contact_us;
    }

    const { languages, observable } = this.getTranslatedCookiesContent();
    this.translationSubscription = observable.subscribe((res) => {
      // Translated observable
      const cookiesContent = {
        // Adding cookies content of all languages
        [this.translate.currentLang]: cmsRawValue.cookiesContent,
        [languages[0]]: res[0][0].translatedText,
        [languages[1]]: res[1][0].translatedText,
      };
      const cms = { ...cmsRawValue, cookiesContent }; // Replacing cookies content with translated data in cms

      if (cms._id) {
        this.cmsService.update(cms).subscribe(
          () => {
            this.translate.get('ADMIN.CMS.SNACKBAR.UPDATED_THE_CMS').subscribe((translation) => {
              this.deleteCmsImages(true);
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          },
          (err) => {
            this.translate.get('ADMIN.CMS.SNACKBAR.ERROR_WHILE_UPDATING_THE_CMS').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.error);
            });
          },
        );
      } else {
        delete cms._id;
        this.cmsService.add(cms).subscribe(
          () => {
            this.translate.get('ADMIN.CMS.SNACKBAR.CREATED_THE_CMS').subscribe((translation) => {
              this.deleteCmsImages(true);
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
            });
          },
          (err) => {
            this.translate.get('ADMIN.CMS.SNACKBAR.ERROR_WHILE_CREATING_THE_CMS').subscribe((translation) => {
              this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.error);
            });
          },
        );
      }
    });
  }

  private onModuleChanges(): void {
    this.socket.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'cms') {
        this.getData();
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  public updateMedia(ev: any, controlName: string): void {
    const currentImage = this.cmsForm.controls[controlName].value;
    if (currentImage) {
      const cms = this.cmsForm.getRawValue();
      if (!cms._id) {
        this.fileManagerService.deleteFileFromAWS(currentImage, true).subscribe((value) => {});
      } else {
        this.deletedImages.push({ filename: currentImage });
      }
    }
    this.cmsForm.controls[controlName].setValue(ev.url);
    this.isUploading = false;
    this.disabledLogo = false;
    this.disabledFavIcon = false;
  }

  public isShippingChecked(): boolean {
    return this.cmsForm.get('isSameAsShippingAddress').value;
  }

  private formCreation(): void {
    this.cmsForm = this.fb.group({
      _id: [{ value: '', disabled: true }],
      name: ['', [Validators.required]],
      logo: [''],
      tagline: ['', [Validators.required]],
      favicon: [''],
      copyright_text: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      cookiesContent: [''],
      activeImages: this.fb.array([]),
      images: this.fb.array([]),
      contact_us: this.fb.group({
        address: ['', [Validators.required, Validators.pattern(/^[0-9]+\s/)]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zip: ['', [Validators.required]],
        country: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^\+[0-9] \(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/)]],
      }),
      shipping: this.fb.group({
        address: ['', [Validators.required, Validators.pattern(/^[0-9]+\s/)]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zip: ['', [Validators.required]],
        country: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^\+[0-9] \(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/)]],
      }),
      isSameAsShippingAddress: [false],
      disableTooltips: [false],
      disableCookiesModal: [false],
    });

    this.cmsForm.valueChanges.pipe(debounceTime(300)).subscribe((v) => {
      if (v.isSameAsShippingAddress) {
        this.cmsForm.patchValue(
          {
            shipping: {
              address: v.contact_us.address,
              city: v.contact_us.city,
              state: v.contact_us.state,
              zip: v.contact_us.zip,
              country: v.contact_us.country,
              phone: v.contact_us.phone,
            },
          },
          { emitEvent: false },
        );
        this.cmsForm.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false,
        });
      }
    });

    this.contact_us.statusChanges.pipe().subscribe((res) => {
      if (res === 'INVALID') {
        this.cmsForm.get('isSameAsShippingAddress').disable();
      } else {
        this.cmsForm.get('isSameAsShippingAddress').enable();
      }
    });
  }

  public uploadStarted(event, isLogo: boolean = false): void {
    this.isUploading = event;
    !isLogo ? (this.disabledLogo = true) : (this.disabledFavIcon = true);
  }

  get shipping(): UntypedFormGroup {
    return this.cmsForm.get('shipping') as UntypedFormGroup;
  }

  get contact_us(): UntypedFormGroup {
    return this.cmsForm.get('contact_us') as UntypedFormGroup;
  }

  public updateAddress(value: any, formGroupName: string): void {
    (this.cmsForm.controls[formGroupName] as UntypedFormGroup).patchValue({
      ...value,
    });
  }

  public getImageUrl(filename: string) {
    return filename ? environment.s3Url + filename : '';
  }

  public deleteImage(imageType, image): void {
    switch (imageType) {
      case 'logo': {
        this.cmsForm.controls['logo'].setValue('');
        break;
      }
      case 'favicon': {
        this.cmsForm.controls['favicon'].setValue('');
        break;
      }
    }
    this.deletedImages.push({ filename: image });
  }

  private deleteCmsImages(disableAlert = false): void {
    if (this.deletedImages && this.deletedImages.length > 0) {
      this.fileManagerService.deleteFileBulkFromAWS(this.deletedImages, disableAlert).subscribe((value) => {
        this.deletedImages = [];
      });
    }
  }

  private getTranslatedCookiesContent(): {
    languages: string[];
    observable: Observable<[Translations[], Translations[]]>;
  } {
    const languages: string[] = Object.keys(Language).filter(
      // Filtered unselected languages
      (lang) => lang !== this.translate.currentLang,
    );
    const textData = [
      // Getting raw data from title, subtitle and description fields
      this.cmsForm.get('cookiesContent').value,
    ];
    const observable = combineLatest([
      // Combined 2 api request observable in one observable
      this.dynmaicTanslationService.translate(textData, languages[0]),
      this.dynmaicTanslationService.translate(textData, languages[1]),
    ]).pipe(first());

    return { languages, observable };
  }
}
