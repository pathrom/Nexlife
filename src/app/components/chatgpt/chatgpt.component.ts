import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OpenAIService } from 'src/app/services/openai.service';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { Profile } from 'src/app/models/user';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') private messageContainer: ElementRef;

  chatHistory = [];
  message;
  profileData: Profile;
  showWhatsappImport = false;
  callFirstTime: boolean = false;

  constructor(public dataInfSv: DataInfoService, private config: SettingsService, private openAi: OpenAIService, private loadSv: LoadingService, private route: ActivatedRoute) {
    this.config.devMode();
  }

  ngOnInit(): void {
    this.subscribeToProfileData();
    this.loadChatHistory();

    this.dataInfSv.setOnConversationImportedCallback(() => {
      this.importedConversation();
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  setDefaultProfileData(): void {
    this.profileData = {
      name: 'Javier',
      surname: 'Paton',
      email: 'javier.paton@example.com',
      age: '52',
      work: 'Comercial',
      hobbies: ['Futbol', 'Jardin', 'Obras'],
      featured_phrases: ['Eres un crack', 'Que pasa kun'],
      country: 'Spain',
    };
  }

  subscribeToProfileData(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['profileData']) {
        const profileData = JSON.parse(params['profileData']);
        this.profileData = { ...profileData };
      } else {
        this.setDefaultProfileData();
      }

      console.log('🚀 ~ ChatgptComponent ~ subscribeToProfileData ~ this.profileData:', this.profileData);
    });
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

  // Event Handlers
  handleMessageSent(event: string): void {
    if (!this.callFirstTime) {
      this.callFirstTime = true;
    }

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

  async importedConversation(): Promise<void> {
    const firstMessageIndex = this.chatHistory.findIndex((item) => item.type === 'user' || item.type === 'bot');
    const insertIndex = firstMessageIndex === -1 ? 0 : firstMessageIndex;
    let message = '##########\nTake this conversation as context and acquire this personality based on the frequency of words this person uses and try to imitate them as well as possible:\n' + this.dataInfSv.converWhatsapp + '\n########## No response needed, only context';
    console.log('🚀 ~ ChatgptComponent ~ importedConversation ~ message:', message);

    this.chatHistory.splice(insertIndex, 0, {
      message: message,
      type: 'bot',
      hidden: true,
    });

    this.saveChatHistory();
    this.showWhatsappImport = false;

    const model = 'gpt-3.5-turbo';
    const role = ChatCompletionRequestMessageRoleEnum.User;
    const instructions: any = [
      {
        role: role,
        content: message,
      },
      ...this.mapChatHistoryToRole(),
    ];

    let chatResponse = await this.openAi.sendChatGpt(instructions, model);
    console.log('🚀 ~ ChatgptComponent ~ importedConversation ~ chatResponse:', chatResponse);
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
      message: this.message,
    };
    return JSON.stringify(inputData);
  }

  async callChatGpt(): Promise<void> {
    this.chatHistory.push({ message: this.message, type: 'user' });
    this.loadSv.isLoading = true;

    const model = this.config.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo'; //gpt-3.5-turbo-0301
    const inputText = this.formatInputMessage();

    let instructions: any[] = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: inputText,
      },
      ...this.mapChatHistoryToRole(),
    ];

    if (this.callFirstTime && this.chatHistory.length > 0) {
      instructions = [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: inputText,
        },
        ...this.mapChatHistoryToRole(),
      ];
    } else {
      instructions = instructions.slice(-1);
    }

    let chatResponse = await this.openAi.sendChatGpt(instructions, model);

    this.chatHistory.push({ message: chatResponse, type: 'bot' });
    this.scrollToBottom();
    this.message = '';
    this.loadSv.isLoading = false;

    if (!this.callFirstTime || this.chatHistory.length === 0) {
      this.callFirstTime = true;
    }
  }

  loadChatHistory(): void {
    let storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory && storedChatHistory !== '[]') {
      if (this.config.enableContextHistoryChat === true) {
        this.chatHistory = JSON.parse(storedChatHistory);
      }
    }
    if (this.chatHistory.length > 0 && !this.callFirstTime) {
      this.callFirstTime = true;
    }
  }

  resetHistoryChat(): void {
    localStorage.removeItem('chatHistory');
    this.chatHistory = [];
    this.saveChatHistory();
  }
}
