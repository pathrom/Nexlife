import { Injectable } from '@angular/core';
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {
    this.loadChatGPT();
  }
  // gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301
  versionGPT = '3';
  role: string = 'user'; // system, user
  openAi: OpenAIApi;

  changeVersionChatGPT(version: string): void {
    console.log('🚀 ~ ChatgptComponent ~ changeVersionChatGPT ~ version:', version);
    this.versionGPT = version;
  }

  loadChatGPT() {
    const apiKey = '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';
    this.openAi = this.createOpenAiClient(apiKey);
  }

  createOpenAiClient(apiKey: string): OpenAIApi {
    const configuration = new Configuration({ apiKey });
    return new OpenAIApi(configuration);
  }
}
