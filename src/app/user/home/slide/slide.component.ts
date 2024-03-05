import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CartService } from 'src/app/user/cart/cart.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent {
  @Input() slideData;
  @Input() loading;

  constructor(private cartService: CartService) {}

  public addToCart() {
    this.cartService.addToCart(this.slideData);
  }
}
