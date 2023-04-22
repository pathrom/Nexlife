import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}

  versionGPT = '3';
  role: string = 'user'; // system, user

  changeVersionChatGPT(version: string): void {
    console.log('🚀 ~ ChatgptComponent ~ changeVersionChatGPT ~ version:', version);
    this.versionGPT = version;
  }
}
