import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private route: ActivatedRoute) {}

  enableContextHistoryChat = true;
  versionGPT = '3'; // gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301
  numLettersChat = 100;
  isDevMode: boolean = false;
  role: string = 'user'; // system, user

  changeVersionChatGPT(version: string): void {
    console.log('🚀 ~ ChatgptComponent ~ changeVersionChatGPT ~ version:', version);
    this.versionGPT = version;
  }

  devMode() {
    if (this.route.snapshot.queryParamMap.get('devMode')) {
      console.log('Yes devMode');
      this.isDevMode = true;
    } else {
      console.log('No devMode');
    }
  }

  getApiKey() {
    return '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';
  }
}
