import { Model } from 'nextsapien-component-lib';

export class Order implements Model {
  _id: string = '';
  urlName: string = 'orders';
  first_name: string;
  last_name: string;
  company_name: string;
  country: string;
  address_line_1: string;
  address_line_2: string;
  town: string;
  state: string;
  postal_code: string;
  email: string;
  phone: string;
  cart: {
    items: [
      {
        product: {};
        quantity: number;
      },
    ];
    total_price: number;
  };
  order_status: {};
  isDeleted = false;
  payment_id: string;
  created_at: Date;
  updated_at: Date;
}
