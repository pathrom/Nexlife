import { LoadingService } from 'src/app/services/loading.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DevModeService } from 'src/app/services/devMode.service';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WhatsappImportComponent } from '../whatsapp-import/whatsapp-import.component';
import { Profile } from 'src/app/models/user';
import { OpenAIService } from 'src/app/services/openai.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  message = '';
  chatHistory = [];

  config = {
    enableContextHistoryChat: true,
  };

  callFirstTime: boolean = false;
  profileData;
  itemsSubMenu: MenuItem[];
  overlayVisible: boolean = false;
  showWhatsappImport = false;

  constructor(private route: ActivatedRoute, public svDvMod: DevModeService, public dataInfSv: DataInfoService, private sttgs: SettingsService, private openAi: OpenAIService, public loadSv: LoadingService) {
    loadSv.isLoading = true;
    this.devMode();
    this.moldProfile();
    this.initializeSubMenu();
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
    }, 100); // Puedes ajustar este valor si es necesario
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

  toggle() {
    this.overlayVisible = !this.overlayVisible;
  }

  initializeSubMenu() {
    this.itemsSubMenu = [
      {
        label: 'Options',
        items: [
          {
            label: 'Whatsapp Import',
            icon: 'pi pi-refresh',
            command: () => {
              this.showWhatsappImport = true;
            },
          },
        ],
      },
    ];
  }

  moldProfile() {
    this.profileData = {
      name: 'Javier Paton La Rosa',
      age: '52',
      work: 'Comercial',
      hobbies: 'Futbol, Jardin, Obras',
      featured_phrases: '',
    };

    console.log('🚀 ~ ChatgptComponent ~ moldProfile ~ this.profileData:', this.profileData);
    // this.route.queryParams.subscribe((params) => {
    //   if (params['profileData']) {
    //     const profileData = JSON.parse(params['profileData']);
    //     const profile: Profile = {
    //       name: profileData.name,
    //       age: profileData.age,
    //       work: profileData.work,
    //       hobbies: profileData.hobbies,
    //       featured_phrases: profileData.featured_phrases,
    //     };

    //     console.log(profile);

    //     this.profileData = profile;
    //   }
    // });
  }

  saveChatHistory(): void {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    // show message chat history saved

    console.log('🚀 ~ ChatgptComponent ~ saveChatHistory ~ this.chatHistory:', this.chatHistory);
  }

  mapChatHistoryToRole(): any[] {
    return this.chatHistory.map((item) => ({
      role: item.type === 'user' ? ChatCompletionRequestMessageRoleEnum.User : ChatCompletionRequestMessageRoleEnum.Assistant,
      content: item.message,
    }));
  }

  formatInputMessage(): string {
    // const context = this.chatHistory && this.chatHistory.length > 0 ? this.chatHistory.map((item) => item.message).join(' ') : '';
    const context = '';
    const instructions = `Simulate the following Profile without annotations. Respond as the person with a unique personality based on the data, in ${this.sttgs.numLettersChat} characters or less.`;
    const inputData = {
      context: context,
      instructions: instructions,
      profileData: this.profileData,
      message: this.message,
    };
    console.log('🚀 ~ ChatgptComponent ~ formatInputMessage ~ inputData:', inputData);
    return JSON.stringify(inputData);
  }

  async callChatGpt(): Promise<void> {
    // Añade esta línea para agregar el mensaje del usuario al historial de la conversación
    this.chatHistory.push({ message: this.message, type: 'user' });

    this.loadSv.isLoading = true;
    this.callFirstTime = true;
    const model = this.sttgs.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo-0301'; //gpt-3.5-turbo

    let inputText = '';

    inputText = this.formatInputMessage();

    const response = await this.openAi.openAi.createChatCompletion({
      model: model,
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: inputText,
        },
        ...this.mapChatHistoryToRole(),
      ],
    });

    const chatResponse = response.data.choices[0].message.content;

    const cost = response.data.usage.total_tokens;
    console.log('🚀 ~ ChatgptComponent ~ callChatGpt ~ cost:', cost);

    this.chatHistory.push({ message: chatResponse, type: 'bot' });
    this.scrollToBottom(); // Agrega esta línea aquí
    console.log('\n' + chatResponse + '\n');
    this.sttgs.getTokensUsedCost(response.data.usage.total_tokens);
    // this.saveChatHistory(); // Guardar la conversación en LocalStorage
    this.message = '';
    this.loadSv.isLoading = false;
  }

  loadChatHistory(): void {
    let storedChatHistory = localStorage.getItem('chatHistory');
    console.log('🚀 ~ ChatgptComponent ~ loadChatHistory ~ storedChatHistory:', storedChatHistory);

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

  devMode() {
    console.log('🚀 ~ ChatgptComponent ~ devMode ~ this.route.snapshot:', this.route.snapshot);
    if (this.route.snapshot.queryParamMap.get('devMode')) {
      console.log('Yes devMode');
      this.svDvMod.isDevMode = true;
    } else {
      console.log('No devMode');
    }
  }

  resetHistoryChat(): void {
    localStorage.removeItem('chatHistory');
    this.chatHistory = [];

    this.saveChatHistory();
  }
}
