import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationMessage } from '../../notification_messages/message.model';

@Component({
  selector: 'app-notification-list-item',
  templateUrl: './notification-list-item.component.html',
  styleUrls: ['./notification-list-item.component.scss'],
})
export class NotificationListItemComponent {
  @Input() messages: NotificationMessage[];
  @Input() isEarlier: boolean;

  @Output() opened = new EventEmitter<NotificationMessage>();
  @Output() deleted = new EventEmitter<NotificationMessage>();
  @Output() read = new EventEmitter<NotificationMessage>();

  public openNotification = (notification: NotificationMessage) => this.opened.emit(notification);

  public markAsRead = (notification: NotificationMessage) => this.read.emit(notification);

  public deleteNotification = (notification: NotificationMessage) => this.deleted.emit(notification);

  public getItemsListAsString(notification: NotificationMessage) {
    return (notification?.order as any).cart.items.map((item) => item.name).join(', ');
  }

  public handleSubMenuTrigger($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
