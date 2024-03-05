import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { ProductService } from 'src/app/modules/products/product.service';
import { Product } from '../../modules/products/product.model';
import { Cms } from '../../modules/cms/cms.model';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
  public listData: Product[];
  private productsSub: Subscription;
  private cmsSub: Subscription;
  loading;

  public cmsSettings: Cms;

  constructor(private productService: ProductService, private sharedService: SharedService) {}

  ngOnInit() {
    this.loading = true;
    this.productsSub = this.productService.getWithPopulatedFields({ isDeleted: false, active: true }, '').subscribe(
      (products) => {
        this.listData = products;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
    this.cmsSub = this.sharedService.cmsSettingsObs.subscribe((cmsSettings) => {
      this.cmsSettings = cmsSettings;
    });
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
    if (this.cmsSub) {
      this.cmsSub.unsubscribe();
    }
  }
}
