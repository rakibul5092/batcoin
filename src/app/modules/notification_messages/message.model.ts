import { Model } from 'nextsapien-component-lib';
import { Query } from '../contact_queries/query.model';
import { Order } from '../orders/order.model';

export class NotificationMessage implements Model {
  _id: string;
  to: string;
  urlName = 'notification_messages';
  read: boolean;
  contact_query: Query;
  order: Order;
  message: string;
  is_viewed: boolean;
}
