import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavController } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { CartService } from '../cart/cart.service';
import { SharedService } from '../../shared/shared.service';
import { ProductService } from 'src/app/modules/products/product.service';
import { Product } from '../../modules/products/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit, OnDestroy {
  public product: Product;
  public products: Product[];
  public productId;

  public isLoading = false;
  private productsSub: Subscription;

  public quantity = 1;

  public fullresImage: any;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private productService: ProductService,
    private cartService: CartService,
    public sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('productId')) {
        this.navCtrl.navigateBack('/home');
        return;
      }
      this.productId = paramMap.get('productId');
    });
    this.loading = true;
    this.productsSub = this.productService.getWithPopulatedFields({ isDeleted: false, active: true }, '').subscribe((products) => {
      if (products.length) {
        this.product = products.find((p) => p.slug === this.productId);
        if (this.product) {
          this.products = products.filter((p) => p.slug !== this.productId);
          if (this.product.progressiveImages && this.product.progressiveImages.length > 0) {
            this.transform(this.product.progressiveImages ? this.product.progressiveImages[0] : null);
          }
        } else {
          this.navCtrl.navigateForward('404');
        }
        this.loading = false;
      }
    });
  }

  ionViewWillEnter() {}

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }

  public addToCart() {
    this.cartService.addToCart(this.product, this.quantity);
  }

  public transform(image) {
    if (!image || !image.url) {
      return;
    }
    this.fullresImage = image.url.startsWith('images') ? this.sharedService.getImageUrl(image.url) : this.sharedService.getS3ImageUrl(image.url);
  }

  public verifyQuantity() {
    if (this.quantity < 1 || !this.quantity) {
      this.quantity = 1;
    }
  }
}
