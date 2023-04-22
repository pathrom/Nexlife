import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataInfoService {
  costMsg = '';
  converWhatsapp: any;
  private onConversationImportedCallback: () => void;

  constructor(private sttngs: SettingsService) {}

  getTokensUsedCost(tokensUsed: number): void {
    const COST_PER_TOKEN = this.sttngs.versionGPT === '4' ? 0.00008 : 0.000002;
    const cost = tokensUsed * COST_PER_TOKEN;
    this.costMsg = `Tokens used: ${tokensUsed} \n Cost: ${cost.toFixed(4)}`;

    console.log('🚀 ~ DataInfoService ~ getTokensUsedCost ~ this.costMsg:', this.costMsg);
  }

  setOnConversationImportedCallback(callback: () => void): void {
    this.onConversationImportedCallback = callback;
  }

  conversationImported(): void {
    if (this.onConversationImportedCallback) {
      this.onConversationImportedCallback();
    }
  }
}
