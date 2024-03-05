import { Model } from 'nextsapien-component-lib';

export class Status implements Model {
  _id: string;
  urlName = 'order_statuses';
  title: string;
  description: string;
  active: boolean;
  default_status: boolean;
}
