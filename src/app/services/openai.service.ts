import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  openAi: OpenAIApi;

  constructor(private http: HttpClient, private sttgs: SettingsService) {}

  loadChatGPT() {
    const apiKey = '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';
    this.openAi = this.createOpenAiClient(apiKey);
  }

  createOpenAiClient(apiKey: string): OpenAIApi {
    const configuration = new Configuration({ apiKey });
    return new OpenAIApi(configuration);
  }

  chat(completion: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `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`,
    };

    return this.http.post<any>(this.apiUrl, completion, { headers });
  }

  async sendChatGpt(model, instructions) {
    try {
      const response = await this.openAi.createChatCompletion({
        model: model,
        messages: instructions,
      });

      const res = response.data.choices[0].message.content;
      return res;
    } catch (error) {
      console.log('Error: ', error);
      return error;
    }
  }
}
