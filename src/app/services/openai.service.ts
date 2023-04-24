import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private openAi: OpenAIApi;
  private readonly COST_PER_TOKEN_GPT_4 = 0.00008;
  private readonly COST_PER_TOKEN_OTHER_VERSIONS = 0.000002;

  constructor(private config: SettingsService) {
    this.loadChatGPT();
  }

  private loadChatGPT() {
    const apiKey = this.config.getApiKey();
    const configuration = new Configuration({ apiKey });
    this.openAi = new OpenAIApi(configuration);
    console.log('🚀 ~ OpenAIService ~ loadChatGPT ~ this.openAi:', this.openAi);
  }

  public async sendChatGpt(instructions, model) {
    console.log('🚀 ~ OpenAIService ~ sendChatGpt ~ instructions:', instructions);
    try {
      const response = await this.openAi.createChatCompletion({
        model: model,
        messages: instructions,
      });

      const res = response.data.choices[0].message.content;
      const tokensUsed = response.data.usage.total_tokens;
      const costPerToken = this.config.versionGPT === '4' ? this.COST_PER_TOKEN_GPT_4 : this.COST_PER_TOKEN_OTHER_VERSIONS;
      const cost = tokensUsed * costPerToken;
      const costMsg = `Tokens used: ${tokensUsed} \n Cost: ${cost.toFixed(4)}`;

      console.log('🚀 ~ OpenAIService ~ sendChatGpt ~ costMsg:', costMsg);

      return res;
    } catch (error) {
      console.log('Error: ', error);
      return error;
    }
  }
}
