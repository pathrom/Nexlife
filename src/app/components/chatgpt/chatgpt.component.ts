import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from './../../models/user';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OpenAIService } from 'src/app/services/openai.service';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') private messageContainer: ElementRef;

  chatHistory: { message: string; type: string; hidden?: boolean }[] = [];
  message: string;
  profileData: Profile;
  showWhatsappImport = false;
  callFirstTime = false;
  private initialMessageSent = false;
  private chatHistoryForAPI: { role: ChatCompletionRequestMessageRoleEnum; content: string }[] = [];

  constructor(public dataInfSv: DataInfoService, private config: SettingsService, private openAi: OpenAIService, private loadSv: LoadingService, private route: ActivatedRoute) {
    this.config.devMode();
  }

  ngOnInit(): void {
    this.subscribeToProfileData();
    this.loadChatHistory();

    this.dataInfSv.setOnConversationImportedCallback(() => {
      // this.importedConversation();
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private async subscribeToProfileData(): Promise<void> {
    if (this.chatHistory.length === 0) {
      this.route.queryParams.subscribe(async (params) => {
        await this.loadProfileData(params);
        await this.sendInitialMessage();
      });
    }
  }

  private async loadProfileData(params: any): Promise<void> {
    if (params['profileData']) {
      const profileData = JSON.parse(params['profileData']);
      this.profileData = { ...profileData };
      localStorage.setItem('profileData', JSON.stringify(this.profileData));
    } else {
      const storedProfileData = localStorage.getItem('profileData');
      if (storedProfileData) {
        this.profileData = JSON.parse(storedProfileData);
      } else {
        this.profileData = this.dataInfSv.setProfileDataDummy();
      }
    }
  }

  private async sendInitialMessage(): Promise<void> {
    this.loadSv.isLoading = true;

    const model = this.config.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo';
    const inputText = this.formatFirstPersonalityMessage();
    const instructions = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: inputText,
      },
      ...this.mapChatHistoryToRole(),
    ];

    await this.openAi.sendChatGpt(instructions, model);

    this.loadSv.isLoading = false;
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

  saveChatHistory(): void {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }

  mapChatHistoryToRole(): { role: ChatCompletionRequestMessageRoleEnum; content: string }[] {
    return this.chatHistory.map((item) => ({
      role: item.type === 'user' ? ChatCompletionRequestMessageRoleEnum.User : ChatCompletionRequestMessageRoleEnum.Assistant,
      content: item.message,
    }));
  }

  formatFirstPersonalityMessage(): string {
    const instructions = `Simulate the following Profile without annotations. Respond as the person with a unique personality based on the data, in ${this.config.numLettersChat} characters or less.`;

    const inputData = {
      instructions: instructions,
      message: this.profileData,
    };
    return JSON.stringify(inputData);
  }

  async callChatGpt(): Promise<void> {
    this.chatHistory.push({ message: this.message, type: 'user' });
    this.loadSv.isLoading = true;

    const model = this.config.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo';
    const instructions = this.generateInstructions(this.message);

    const chatResponse = await this.openAi.sendChatGpt(instructions, model);

    this.chatHistory.push({ message: chatResponse, type: 'bot', hidden: false });
    this.scrollToBottom();
    this.message = '';
    this.loadSv.isLoading = false;

    if (!this.callFirstTime || this.chatHistory.length === 0) {
      this.callFirstTime = true;
    }
  }

  generateInstructions(inputText: string): any[] {
    if (!this.initialMessageSent) {
      this.chatHistoryForAPI.push({
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: this.formatFirstPersonalityMessage(),
      });
    }

    this.chatHistoryForAPI.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: inputText,
    });

    return this.chatHistoryForAPI;
  }

  loadChatHistory(): void {
    const storedChatHistory = localStorage.getItem('chatHistory');
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

  // async importedConversation(): Promise<void> {
  //   console.log('IMPORTED CONVERSATION');
  //   const firstMessageIndex = this.chatHistory.findIndex((item) => item.type === 'user' || item.type === 'bot');
  //   const insertIndex = firstMessageIndex === -1 ? 0 : firstMessageIndex;
  //   const message = '##########\nTake this conversation as context and acquire this personality based on the frequency of words this person uses and try to imitate them as well as possible:\n' + this.dataInfSv.converWhatsapp + '\n########## No response needed, only context';
  //   this.chatHistory.splice(insertIndex, 0, {
  //     message: message,
  //     type: 'bot',
  //     hidden: true,
  //   });

  //   this.saveChatHistory();
  //   this.showWhatsappImport = false;

  //   const model = 'gpt-3.5-turbo';
  //   const role = ChatCompletionRequestMessageRoleEnum.Assistant;
  //   const instructions = [
  //     {
  //       role: role,
  //       content: message,
  //     },
  //     ...this.mapChatHistoryToRole(),
  //   ];

  //   await this.openAi.sendChatGpt(instructions, model);
  // }
}
