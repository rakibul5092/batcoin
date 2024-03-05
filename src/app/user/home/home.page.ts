import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Keyboard, Mousewheel, Pagination, SwiperOptions } from 'swiper';
// install Swiper modules
SwiperCore.use([Autoplay, Keyboard, Mousewheel, Pagination]);

import { ProductService } from 'src/app/modules/products/product.service';
import { Product } from '../../modules/products/product.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public slideOpts: SwiperOptions = {
    speed: 400,
    direction: 'vertical',
    pagination: {
      clickable: true,
    },
    autoplay: {
      delay: 10000,
      disableOnInteraction: true,
    },
    effect: 'flip',
    flipEffect: {
      slideShadows: false,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    mousewheel: true,
  };

  public slides: Product[];
  private defaultQuantity = 4;
  private productsSub: Subscription;
  public loading: boolean;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loading = true;
    this.productsSub = this.productService.getWithPopulatedFields({ isDeleted: false, active: true }, '').subscribe(
      (products) => {
        this.slides = products;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }
}
