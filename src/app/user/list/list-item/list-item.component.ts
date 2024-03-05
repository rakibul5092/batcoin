import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from 'src/app/user/cart/cart.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent {
  @Input() item;

  public addToCartMessage = 'Add to Cart';

  constructor(private router: Router, private cartService: CartService, private translateService: TranslateService) {
    this.translateService.onLangChange.subscribe(() => {
      this.translateService.get('USER.LIST.ADD_TO_CART').subscribe((value) => {
        this.addToCartMessage = value;
      });
    });
  }

  openProduct() {
    this.router.navigate(['/product', this.item.slug]);
  }

  public addToCart(event: any) {
    event.stopPropagation();

    if (this.addToCartMessage === 'Add to Cart') {
      this.addToCartMessage = 'Adding to Cart';
      setTimeout(() => {
        this.addToCartMessage = 'Add to Cart';
      }, 1000);
      this.cartService.addToCart(this.item);
    }
  }
}
