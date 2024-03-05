import { Model } from 'nextsapien-component-lib';

export class Role implements Model {
  _id: string;
  urlName = 'user_roles';
  title: string;
  description: string;
  active: boolean;
}
