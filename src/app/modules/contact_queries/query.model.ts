import { Model } from 'nextsapien-component-lib';

export class Query implements Model {
  _id: string = '';
  urlName = 'user_roles';
  name: string;
  email: string;
  subject: string;
  message: string;
  active: boolean = false;
  isDeleted: boolean = false;
}
