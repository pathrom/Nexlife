// chat-message.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  template: `
    <div [ngClass]="{ 'user-message': item.type === 'user', 'bot-message': item.type === 'bot' }">
      <div class="message" *ngIf="item.message?.trim() !== ''">{{ item.message }}</div>
    </div>
  `,
})
export class ChatMessageComponent {
  @Input() item: any;
}
