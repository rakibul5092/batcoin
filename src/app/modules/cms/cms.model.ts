import { Model } from 'nextsapien-component-lib';

export class Cms implements Model {
  _id: string = '';
  urlName: string = 'cms';
  name: string = '';
  logo: string = '';
  favicon: string = '';
  tagline: string = '';
  copyright_text: string = '';
  email: string = ''; // (optional),
  activeImages: boolean[] = [];
  images: any[] = [];
  cookiesContent: {
    en: string;
    fr: string;
    es: string;
  };
  contact_us: {
    address: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  shipping: {
    address: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  isSameAsShippingAddress: boolean = false;
  disableTooltips: boolean = false;
  disableCookiesModal: boolean = false;
}

export const DEFAULT_CMS: any = {
  logo: 'assets/images/logo-2.png',
  name: 'THE BAT COIN',
  copyright_text: 'COPYRIGHT 2021',
  tagline: 'One coin to remember it all',
  cookiesContent: '',
  contact_us: {
    address: '43 Kingston Street Ste. 4',
    city: 'Boston',
    state: 'MA',
    zip: '02111',
  },
};
