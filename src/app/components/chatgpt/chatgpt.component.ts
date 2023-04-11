import { Component, OnInit } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { ActivatedRoute } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit {
  message = '';
  chatHistory = [];
  openAi: OpenAIApi;
  isLoading = false;
  costMsg = '';
  versionGPT = '3';
  isDevMode: boolean = false;

  options: AnimationOptions = {
    path: '/assets/lotties/load.json',
  };
  styles: Partial<CSSStyleDeclaration> = {
    width: '40vw',
  };
  callFirstTime: boolean = false;
  constructor(private route: ActivatedRoute) {
    this.devMode();
  }

  ngOnInit(): void {
    const apiKey = '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';
    this.openAi = this.createOpenAiClient(apiKey);
  }

  createOpenAiClient(apiKey: string): OpenAIApi {
    const configuration = new Configuration({ apiKey });
    return new OpenAIApi(configuration);
  }

  async callChatGpt(): Promise<void> {
    this.isLoading = true;
    this.callFirstTime = true;

    const model = this.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo';
    const inputText = this.message;

    const response = await this.openAi.createChatCompletion({
      model,
      messages: [{ role: 'system', content: inputText }],
    });

    const chatResponse = response.data.choices[0].message.content;
    this.getTokensUsedCost(response.data.usage.total_tokens);

    await this.callBot(inputText, chatResponse);

    this.isLoading = false;
  }

  getTokensUsedCost(tokensUsed: number): void {
    const COST_PER_TOKEN = this.versionGPT === '4' ? 0.00008 : 0.000002;
    const cost = tokensUsed * COST_PER_TOKEN;
    this.costMsg = `Tokens used: ${tokensUsed} \n Cost: ${cost.toFixed(4)}`;
  }
  async callBot(inputText: string, chatResponse: string): Promise<void> {
    console.log(chatResponse);
    const userMessage = { message: inputText, response: '', type: 'user' };
    const botMessage = { message: chatResponse, response: '', type: 'bot' };

    this.chatHistory.push(userMessage);
    this.chatHistory.push(botMessage);

    this.message = '';
    // await this.speakText(chatResponse);
  }

  async speakText(text: string): Promise<void> {
    const synth = window.speechSynthesis;
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      synth.speak(utterance);
    } else {
      console.warn('Speech synthesis is not supported in this browser.');
    }
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
