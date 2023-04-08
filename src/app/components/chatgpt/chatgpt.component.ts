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
  version = '5';
  isLoading: boolean = false;
  costMsg;

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
    this.isLoading = true;

    let inputText = this.message;

    const response = await this.openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      //   model: 'gpt-4',
      messages: [{ role: 'system', content: inputText }],
    });

    const resultChatGPT = response.data.choices[0].message.content;
    this.getTokensUsedCost(response.data.usage.total_tokens);

    if (this.version === '1') await this.version1(inputText, resultChatGPT);
    if (this.version === '2') await this.version2(inputText, resultChatGPT);
    if (this.version === '3') await this.version3(inputText, resultChatGPT);
    if (this.version === '4') await this.version4(inputText, resultChatGPT);
    if (this.version === '5') await this.version5(inputText, resultChatGPT);

    this.isLoading = false;
  }

  getTokensUsedCost(tokensUsed) {
    const COST_PER_TOKEN = 0.000002;

    const cost = tokensUsed * COST_PER_TOKEN;

    this.costMsg = `Tokens used: ${tokensUsed} \n Cost: ${cost.toFixed(4)}`;
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

  version4(inputText: string, resultChatGPT: string) {
    console.log(resultChatGPT);

    const userMessage = { message: inputText, response: '', type: 'user' };
    const botMessage = { message: resultChatGPT, response: '', type: 'bot' };

    this.chatHistory.push(userMessage);
    this.chatHistory.push(botMessage);

    this.message = '';
  }

  version5(inputText: string, resultChatGPT: string) {
    console.log(resultChatGPT);

    const userMessage = { message: inputText, response: '', type: 'user' };
    const botMessage = { message: resultChatGPT, response: '', type: 'bot' };

    this.chatHistory.push(userMessage);
    this.chatHistory.push(botMessage);

    this.message = '';
    this.speakText(resultChatGPT);
  }

  speakText(text: string) {
    const synth = window.speechSynthesis;

    // Check if speech synthesis is supported by the browser
    if (synth) {
      console.log('🚀 ~ ChatgptComponent ~ speakText ~ synth:', synth);
      const utterance = new SpeechSynthesisUtterance(text);
      synth.speak(utterance);
    } else {
      console.warn('Speech synthesis is not supported in this browser.');
    }
  }
}
