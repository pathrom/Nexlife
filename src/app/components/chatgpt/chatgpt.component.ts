import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
import { ActivatedRoute } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { MenuItem, MessageService } from 'primeng/api';
import { DevModeService } from 'src/app/services/devMode.service';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WhatsappImportComponent } from '../whatsapp-import/whatsapp-import.component';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
})
export class ChatgptComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  message = '';
  chatHistory = [];
  isLoading = true;

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
  profileData;
  itemsSubMenu: MenuItem[];
  overlayVisible: boolean = false;
  showWhatsappImport = false;

  constructor(private route: ActivatedRoute, public svDvMod: DevModeService, public dataInfSv: DataInfoService, private sttgs: SettingsService) {
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
        this.isLoading = false;
      }
    }, 100); // Puedes ajustar este valor si es necesario
  }

  importedConversation(): void {
    // Encuentra el índice del primer mensaje de usuario o bot en la conversación
    const firstMessageIndex = this.chatHistory.findIndex((item) => item.type === 'user' || item.type === 'bot');

    // Si no se encuentra el primer mensaje, asume que el índice es 0
    const insertIndex = firstMessageIndex === -1 ? 0 : firstMessageIndex;

    // Inserta el mensaje de introducción de personalidad en la posición correcta
    this.chatHistory.splice(insertIndex, 0, {
      message: '##########\nTake this conversation as context and acquire this personality based on the frequency of words this person uses and try to imitate them as well as possible:\n' + this.dataInfSv.converWhatsapp + '\n##########',
      type: 'bot',
      hidden: true, // Agrega esta línea
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
    this.route.queryParams.subscribe((params) => {
      if (params['profileData']) {
        this.profileData = JSON.parse(params['profileData']);

        console.log(this.profileData);
      }
    });
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
    if (this.chatHistory && this.chatHistory.length > 0) {
      let context = this.chatHistory.map((item) => item.message).join(' ');
      return `Situation: This is a conversation that we are going to have to simulate the following Profile, I want your output to be without annotations typical of a computer system "Response", simply return me a text answering as the simulated person, Acquires a personality with the different data: ${JSON.stringify(
        this.profileData
      )} \n ---------------------  \n Context: ${context} \n ---------------------  \n Message: ${this.message} \n ---------------------  \n  Intructions: No more than 150 characters`;
    } else {
      return this.message;
    }
  }

  async callChatGpt(): Promise<void> {
    // Añade esta línea para agregar el mensaje del usuario al historial de la conversación
    this.chatHistory.push({ message: this.message, type: 'user' });

    this.isLoading = true;
    this.callFirstTime = true;
    const model = this.sttgs.versionGPT === '4' ? 'gpt-4' : 'gpt-3.5-turbo';

    let inputText = '';

    inputText = this.formatInputMessage();

    const response = await this.sttgs.openAi.createChatCompletion({
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
    this.chatHistory.push({ message: chatResponse, type: 'bot' });
    this.scrollToBottom(); // Agrega esta línea aquí
    console.log('\n' + chatResponse + '\n');
    this.dataInfSv.getTokensUsedCost(response.data.usage.total_tokens);
    this.saveChatHistory(); // Guardar la conversación en LocalStorage
    this.message = '';
    this.isLoading = false;
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
