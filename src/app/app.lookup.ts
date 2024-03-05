import { environment } from '../environments/environment';

export const SHIPPING_APIS = {
  shipment: environment.url + 'api/v1/shipping/shipments/',
  buyShipment: environment.url + 'api/v1/shipping/shipments/buy',
};

export const SHIPPING_CARRIERS: any[] = [
  {
    name: 'USPS',
    logo: 'assets/icon/shipping/ups.svg',
  },
  {
    name: 'UPSDAP',
    logo: 'assets/icon/shipping/usps.svg',
  },
  {
    name: 'LSO',
    logo: 'assets/icon/shipping/lso.jpg',
  },
  {
    name: 'DHLExpress',
    logo: 'assets/icon/shipping/dhl.png',
  },
  {
    name: 'DHL',
    logo: 'assets/icon/shipping/dhl.png',
  },
];
