import { EntityMetadataMap } from '@ngrx/data';

export function selectId<T extends { _id: string }>(entity: T) {
  return entity === null ? undefined : entity._id;
}

const entityMetadata: EntityMetadataMap = {
  cms: { selectId },
  user_roles: { selectId },
  contact_queries: { selectId },
  products: { selectId },
  orders: { selectId },
  users: { selectId },
  notification_messages: { selectId },
  order_statuses: { selectId },
};

const pluralNames = {
  cms: 'cms',
  user_roles: 'user_roles',
  contact_queries: 'contact_queries',
  products: 'products',
  orders: 'orders',
  order_statuses: 'order_statuses',
  users: 'users',
  notification_messages: 'notification_messages',
};

export const entityConfig = {
  entityMetadata,
  pluralNames,
};
