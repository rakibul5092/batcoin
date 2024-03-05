import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBARTYPE } from 'nextsapien-component-lib';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cms, DEFAULT_CMS } from '../modules/cms/cms.model';
import { CmsService } from '../modules/cms/cms.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private cmsSettingsObservable = new BehaviorSubject<Cms>(null);
  private cmsSettings: Cms;

  get cmsSettingsObs() {
    return this.cmsSettingsObservable.asObservable();
  }

  get getloadingImgUrl() {
    return environment.loadingImgUrl;
  }

  constructor(private cmsService: CmsService, private snackBar: MatSnackBar) {
    this.fetchCmsSettings().subscribe();
  }

  getImageUrl(filename: string) {
    return environment.url + filename;
  }

  getS3ImageUrl(filename: string) {
    return environment.s3Url + filename;
  }

  public getCmsSettings() {
    return this.cmsSettings;
  }

  public openSnackBar(title: string, msg: string = '', type: SNACKBARTYPE, duration?: number) {
    return this.snackBar.open(title, msg, {
      duration: duration || 10000,
      panelClass: [type],
    });
  }

  private fetchCmsSettings() {
    return this.cmsService.getAll().pipe(
      tap((cmsSettings) => {
        if (cmsSettings.length > 0) {
          this.cmsSettingsObservable.next(cmsSettings[0]);
          this.cmsSettings = cmsSettings[0];
          return this.cmsSettings;
        } else {
          this.cmsSettings = DEFAULT_CMS;
          this.cmsSettingsObservable.next(this.cmsSettings);
          return this.cmsSettings;
        }
      }),
    );
  }
}
