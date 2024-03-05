import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-details-view',
  templateUrl: './product-details-view.component.html',
  styleUrls: ['./product-details-view.component.scss'],
})
export class ProductDetailsViewComponent implements OnInit {
  public lang = 'en';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private translateService: TranslateService, public dialogRef: MatDialogRef<ProductDetailsViewComponent>) {
    this.translateService.use(localStorage.getItem('language') || 'en');
  }

  ngOnInit(): void {
    this.lang = this.translateService.currentLang;
  }
}
