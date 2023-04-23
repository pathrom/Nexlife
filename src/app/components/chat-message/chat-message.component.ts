// chat-message.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  styleUrls: ['./chat-message.component.scss'],
  template: `
    <div [ngClass]="{ 'user-message': item.type === 'user', 'bot-message': item.type === 'bot' }">
      <div class="message" *ngIf="isString(item.message) && item.message.trim() !== ''">{{ item.message }}</div>
    </div>
  `,
})
export class ChatMessageComponent {
  @Input() item: any;

  isString(value: any): boolean {
    return typeof value === 'string';
  }
}
