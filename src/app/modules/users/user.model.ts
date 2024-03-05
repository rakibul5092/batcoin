export class User {
  _id: string = '';
  urlName: string = 'users';
  name: string;
  description: string;
  email: string;
  active: boolean = false;
  is_email_verified: boolean = false;
  isDeleted: boolean = false;
}
