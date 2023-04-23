import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OpenAIService } from 'src/app/services/openai.service';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') private messageContainer: ElementRef;

  chatHistory = [];
  message;
  profileData;
  callFirstTime: boolean = false;
  showWhatsappImport = false;

  constructor(public dataInfSv: DataInfoService, private config: SettingsService, private openAi: OpenAIService, private loadSv: LoadingService) {
    this.config.devMode();
  }

  ngOnInit(): void {
    this.loadChatHistory();

    this.dataInfSv.setOnConversationImportedCallback(() => {
      this.importedConversation();
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        const messageContainerElement = this.messageContainer.nativeElement;
        messageContainerElement.scrollTop = messageContainerElement.scrollHeight;
        this.loadSv.isLoading = false;
      }
    }, 100);
  }

  handleMessageSent(event: string): void {
    if (event === 'whatsappImport') {
      this.showWhatsappImport = true;
    } else {
      this.message = event;
      this.callChatGpt();
    }
  }

  handleWhatsappImportClosed(): void {
    this.showWhatsappImport = false;
  }

  importedConversation(): void {
    const firstMessageIndex = this.chatHistory.findIndex((item) => item.type === 'user' || item.type === 'bot');
    const insertIndex = firstMessageIndex === -1 ? 0 : firstMessageIndex;

    this.chatHistory.splice(insertIndex, 0, {
      message: '##########\nTake this conversation as context and acquire this personality based on the frequency of words this person uses and try to imitate them as well as possible:\n' + this.dataInfSv.converWhatsapp + '\n##########',
      type: 'bot',
      hidden: true,
    });

    this.saveChatHistory();
    this.showWhatsappImport = false;
  }

  moldProfile() {
    this.profileData = {
      name: 'Javier Paton La Rosa',
      age: '52',
      work: 'Comercial',
      hobbies: 'Futbol, Jardin, Obras',
      featured_phrases: '',
    };
  }

  saveChatHistory(): void {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }

  mapChatHistoryToRole(): any[] {
    return this.chatHistory.map((item) => ({
      role: item.type === 'user' ? ChatCompletionRequestMessageRoleEnum.User : ChatCompletionRequestMessageRoleEnum.Assistant,
      content: item.message,
    }));
  }

  formatInputMessage(): string {
    const context = '';
    const instructions = `Simulate the following Profile without annotations. Respond as the person with a unique personality based on the data, in ${this.config.numLettersChat} characters or less.`;
    const inputData = {
      context: context,
      instructions: instructions,
      profileData: this.profileData,
      message: this.message,
    };
    return JSON.stringify(inputData);
  }

  async callChatGpt(): Promise<void> {
    this.chatHistory.push({ message: this.message, type: 'user' });
    this.loadSv.isLoading = true;
    this.callFirstTime = true;

    const model = this.config.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo-0301'; //gpt-3.5-turbo-0301
    const inputText = this.formatInputMessage();

    const instructions: any = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: inputText,
      },
      ...this.mapChatHistoryToRole(),
    ];

    let chatResponse = await this.openAi.sendChatGpt(instructions, model);

    this.chatHistory.push({ message: chatResponse, type: 'bot' });
    this.scrollToBottom();
    this.message = '';
    this.loadSv.isLoading = false;
  }

  loadChatHistory(): void {
    let storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory && storedChatHistory !== '[]') {
      if (this.config.enableContextHistoryChat === true) {
        this.chatHistory = JSON.parse(storedChatHistory);
        this.callFirstTime = true;
      }
    }
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

  resetHistoryChat(): void {
    localStorage.removeItem('chatHistory');
    this.chatHistory = [];
    this.saveChatHistory();
  }
}
