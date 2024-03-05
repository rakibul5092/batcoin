import { Model } from 'nextsapien-component-lib';
import { Product } from '../products/product.model';

export class Cart implements Model {
  _id: string = '';
  urlName: string = 'orders';
  items: {
    product: Product;
    quantity: number;
  }[] = [
    {
      product: new Product(),
      quantity: 0,
    },
  ];
  total_price: number;
}
