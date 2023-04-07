import { Component, OnInit } from '@angular/core';
// const { Configuration, OpenAIApi } = require('openai');
import { Configuration, OpenAIApi } from 'openai';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit {
  message: string = '';
  chatHistory: { message: string; response: any }[] = [];
  openAi: any;
  version = '3';

  constructor() {}

  ngOnInit() {
    this.openAi = this.createOpenAiClient(
      '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'
    );
  }
  createOpenAiClient(apiKey: string) {
    const configuration = new Configuration({ apiKey });
    return new OpenAIApi(configuration);
  }

  async callChatGpt() {
    let inputText = this.message;

    const response = await this.openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: inputText }],
    });

    const resultChatGPT = response.data.choices[0].message.content;

    if (this.version === '1') this.version1(inputText, resultChatGPT);
    if (this.version === '2') this.version2(inputText, resultChatGPT);
    if (this.version === '3') this.version3(inputText, resultChatGPT);
  }

  version1(inputText: string, resultChatGPT: string) {
    console.log(resultChatGPT);
  }

  version2(inputText: string, resultChatGPT: string) {
    console.log(resultChatGPT);

    this.chatHistory.push({ message: inputText, response: resultChatGPT });
    this.message = '';
  }

  version3(inputText: string, resultChatGPT: string) {
    console.log(resultChatGPT);

    const userMessage = { message: inputText, response: '', type: 'user' };
    const botMessage = { message: resultChatGPT, response: '', type: 'bot' };

    this.chatHistory.push(userMessage);
    this.chatHistory.push(botMessage);

    this.message = '';
  }
}
