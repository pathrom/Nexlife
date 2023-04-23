import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  @Output() messageSent = new EventEmitter<string>();
  message = '';
  itemsSubMenu: MenuItem[];

  constructor() {
    this.initializeSubMenu();
  }

  initializeSubMenu() {
    this.itemsSubMenu = [
      {
        label: 'Options',
        items: [
          {
            label: 'Whatsapp Import',
            icon: 'pi pi-refresh',
            command: () => {
              this.messageSent.emit('whatsappImport');
            },
          },
        ],
      },
    ];
  }

  onSendMessage() {
    this.messageSent.emit(this.message);
    this.message = '';
  }
}
