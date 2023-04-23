import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  openAi: OpenAIApi;

  constructor(private config: SettingsService) {
    this.loadChatGPT();
  }

  loadChatGPT() {
    const apiKey = this.config.getApiKey();
    this.openAi = this.createOpenAiClient(apiKey);
  }

  createOpenAiClient(apiKey: string): OpenAIApi {
    const configuration = new Configuration({ apiKey });
    return new OpenAIApi(configuration);
  }

  async sendChatGpt(instructions, model) {
    try {
      const response = await this.openAi.createChatCompletion({
        model: model,
        messages: instructions,
      });

      const res = response.data.choices[0].message.content;
      this.getTokensUsedCost(response.data.usage.total_tokens);

      return res;
    } catch (error) {
      console.log('Error: ', error);
      return error;
    }
  }

  getTokensUsedCost(tokensUsed: number): void {
    const COST_PER_TOKEN = this.config.versionGPT === '4' ? 0.00008 : 0.000002;
    const cost = tokensUsed * COST_PER_TOKEN;
    const costMsg = `Tokens used: ${tokensUsed} \n Cost: ${cost.toFixed(4)}`;

    console.log('🚀 ~ SettingsService ~ getTokensUsedCost ~ costMsg:', costMsg);
  }
}
