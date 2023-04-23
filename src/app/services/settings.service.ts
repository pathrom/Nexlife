import { Injectable } from '@angular/core';
import { OpenAIService } from './openai.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private openAiSv: OpenAIService, private route: ActivatedRoute) {
    this.openAiSv.loadChatGPT();
  }

  enableContextHistoryChat = true;
  versionGPT = '3';
  numLettersChat = 100;
  isDevMode: boolean = false;

  // gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301

  role: string = 'user'; // system, user

  changeVersionChatGPT(version: string): void {
    console.log('🚀 ~ ChatgptComponent ~ changeVersionChatGPT ~ version:', version);
    this.versionGPT = version;
  }

  getTokensUsedCost(tokensUsed: number): void {
    const COST_PER_TOKEN = this.versionGPT === '4' ? 0.00008 : 0.000002;
    const cost = tokensUsed * COST_PER_TOKEN;
    const costMsg = `Tokens used: ${tokensUsed} \n Cost: ${cost.toFixed(4)}`;

    console.log('🚀 ~ SettingsService ~ getTokensUsedCost ~ costMsg:', costMsg);
  }

  devMode() {
    if (this.route.snapshot.queryParamMap.get('devMode')) {
      console.log('Yes devMode');
      this.isDevMode = true;
    } else {
      console.log('No devMode');
    }
  }
}
