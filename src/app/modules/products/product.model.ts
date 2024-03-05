import { Model } from 'nextsapien-component-lib';

export class Product implements Model {
  _id: string = '';
  urlName: string = 'products';
  title: MultiLanguageData;
  subTitle: MultiLanguageData;
  description: MultiLanguageData;
  category: MultiLanguageData;
  imageUrl: string;
  imageUrlProgressive: string;
  backPath: string;
  backPathProgressive: string;
  prevPrice: number;
  currentPrice: number;
  slug: string;
  images: string[];
  activeImages: boolean[];
  progressiveImages: any[];
  active: boolean = false;
  isDeleted: boolean = false;
  parcel: any;
  index: number;
}

interface MultiLanguageData {
  en: string;
  fr: string;
  es: string;
}

export interface IProgressiveImage {
  _id?: string;
  active: boolean;
  label: string;
  url: string;
  transient: boolean;
  deleted?: boolean;
}
