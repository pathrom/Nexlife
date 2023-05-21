import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from './../../models/user';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OpenAIService } from 'src/app/services/openai.service';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { LoadingService } from 'src/app/services/loading.service';
import { WhatsappImportService } from 'src/app/services/whatsapp-import.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit, AfterViewInit {
  message: string;
  profileData: Profile;
  callFirstTime = false;
  private initialMessageSent = false;

  constructor(public dataInfSv: DataInfoService, private config: SettingsService, private openAi: OpenAIService, private loadSv: LoadingService, private route: ActivatedRoute, public whatsappImpSv: WhatsappImportService) {
    this.config.devMode();
  }

  ngOnInit(): void {
    this.subscribeToProfileData();
    this.loadChatHistory();

    this.dataInfSv.setOnConversationImportedCallback(() => {
      this.whatsappImpSv.importedConversation();
    });
  }

  ngAfterViewInit(): void {
    this.loadSv.scrollToBottom();
  }

  private async subscribeToProfileData(): Promise<void> {
    if (this.dataInfSv.chatHistory.length === 0) {
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
      ...this.dataInfSv.mapChatHistoryToRole(),
    ];

    await this.openAi.sendChatGpt(instructions, model);

    this.loadSv.isLoading = false;
  }

  handleMessageSent(event: string): void {
    if (!this.callFirstTime) {
      this.callFirstTime = true;
    }

    if (event === 'whatsappImport') {
      this.whatsappImpSv.showWhatsappImport = true;
    } else {
      this.message = event;
      this.callChatGpt();
    }
  }

  handleWhatsappImportClosed(): void {
    this.whatsappImpSv.showWhatsappImport = false;
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
    this.dataInfSv.chatHistory.push({ message: this.message, type: 'user' });
    this.loadSv.isLoading = true;

    const model = this.config.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo';
    const instructions = this.generateInstructions(this.message);

    const chatResponse = await this.openAi.sendChatGpt(instructions, model);

    this.dataInfSv.chatHistory.push({ message: chatResponse, type: 'bot', hidden: false });
    this.loadSv.scrollToBottom();
    this.message = '';
    this.loadSv.isLoading = false;

    if (!this.callFirstTime || this.dataInfSv.chatHistory.length === 0) {
      this.callFirstTime = true;
    }
  }

  generateInstructions(inputText: string): any[] {
    if (!this.initialMessageSent) {
      this.dataInfSv.chatHistoryForAPI.push({
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: this.formatFirstPersonalityMessage(),
      });
    }

    this.dataInfSv.chatHistoryForAPI.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: inputText,
    });

    return this.dataInfSv.chatHistoryForAPI;
  }

  loadChatHistory(): void {
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory && storedChatHistory !== '[]') {
      if (this.config.enableContextHistoryChat === true) {
        this.dataInfSv.chatHistory = JSON.parse(storedChatHistory);
      }
    }
    if (this.dataInfSv.chatHistory.length > 0 && !this.callFirstTime) {
      this.callFirstTime = true;
    }
  }
}
