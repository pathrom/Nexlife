import { Component, OnInit } from '@angular/core';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';
import { ActivatedRoute } from '@angular/router';
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
  role: string = 'user'; // system, user
  config = {
    enableContextHistoryChat: true,
  };
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
    this.loadChatHistory();
  }

  createOpenAiClient(apiKey: string): OpenAIApi {
    const configuration = new Configuration({ apiKey });
    return new OpenAIApi(configuration);
  }

  saveChatHistory(): void {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }

  async callChatGpt(): Promise<void> {
    this.isLoading = true;
    this.callFirstTime = true;
    let inputText = '';
    const model = this.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo';

    if (this.chatHistory && this.chatHistory.length > 0) {
      let context = this.chatHistory.map((item) => item.message).join(' ');
      inputText =
        'Context: ' +
        context +
        ' --------------------- Message: ' +
        this.message;
    } else {
      inputText = this.message;
    }

    console.log('🚀 ~ ChatgptComponent ~ callChatGpt ~ inputText:', inputText);

    const response = await this.openAi.createChatCompletion({
      model,
      messages: [
        {
          role: this.role as ChatCompletionRequestMessageRoleEnum,
          content: inputText,
        },
      ],
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

  loadChatHistory(): void {
    let storedChatHistory = localStorage.getItem('chatHistory');
    console.log(
      '🚀 ~ ChatgptComponent ~ loadChatHistory ~ storedChatHistory:',
      storedChatHistory
    );

    if (storedChatHistory && storedChatHistory !== '[]') {
      if (this.config.enableContextHistoryChat === true) {
        this.chatHistory = JSON.parse(storedChatHistory);
        this.callFirstTime = true;
      }
    }
  }

  async callBot(inputText: string, chatResponse: string): Promise<void> {
    console.log(chatResponse);
    let userMessage = {};

    if (this.chatHistory.length > 0) {
      userMessage = { message: this.message, response: '', type: 'user' };
    } else {
      userMessage = { message: inputText, response: '', type: 'user' };
    }

    const botMessage = { message: chatResponse, response: '', type: 'bot' };

    this.chatHistory.push(userMessage);
    this.chatHistory.push(botMessage);
    this.saveChatHistory(); // Guardar la conversación en LocalStorage

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
    console.log(
      '🚀 ~ ChatgptComponent ~ devMode ~ this.route.snapshot:',
      this.route.snapshot
    );
    if (this.route.snapshot.queryParamMap.get('devMode')) {
      console.log('Yes devMode');
      this.isDevMode = true;
    } else {
      console.log('No devMode');
    }
  }

  changeVersionChatGPT(version: string): void {
    console.log(
      '🚀 ~ ChatgptComponent ~ changeVersionChatGPT ~ version:',
      version
    );
    this.versionGPT = version;
  }
  resetHistoryChat(): void {
    localStorage.removeItem('chatHistory');
    this.chatHistory = [];

    this.saveChatHistory();
  }
}
