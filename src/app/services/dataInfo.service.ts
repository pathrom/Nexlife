import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataInfoService {
  costMsg = '';
  converWhatsapp: any = [];

  private onConversationImportedCallback: () => void;

  constructor() {}

  setOnConversationImportedCallback(callback: () => void): void {
    this.onConversationImportedCallback = callback;
  }

  conversationImported(): void {
    if (this.onConversationImportedCallback) {
      this.onConversationImportedCallback();
    }
  }
}
