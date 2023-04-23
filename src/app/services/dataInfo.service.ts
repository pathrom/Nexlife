import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataInfoService {
  costMsg = '';
  converWhatsapp: any = [];

  private onConversationImportedCallback: () => void;

  constructor(private sttngs: SettingsService) {}

  setOnConversationImportedCallback(callback: () => void): void {
    this.onConversationImportedCallback = callback;
  }

  conversationImported(): void {
    if (this.onConversationImportedCallback) {
      this.onConversationImportedCallback();
    }
  }
}
