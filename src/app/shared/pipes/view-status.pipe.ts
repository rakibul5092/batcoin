import { Pipe, PipeTransform } from '@angular/core';
import { NotificationMessage } from 'src/app/modules/notification_messages/message.model';

@Pipe({
  name: 'viewStatus',
})
export class ViewStatusPipe implements PipeTransform {
  transform(value: NotificationMessage[], isViewed: boolean, ...args: unknown[]): NotificationMessage[] {
    if (value && value.length > 0) {
      return value.filter((item) => item.is_viewed === isViewed);
    }
    return null;
  }
}
