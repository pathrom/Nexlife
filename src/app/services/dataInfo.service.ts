import { Injectable } from '@angular/core';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class DataInfoService {
  costMsg = '';
  converWhatsapp: any = [];
  chatHistory: { message: string; type: string; hidden?: boolean }[] = [];
  chatHistoryForAPI: { role: ChatCompletionRequestMessageRoleEnum; content: string }[] = [];

  private onConversationImportedCallback: () => void;

  constructor() {}

  saveChatHistory(): void {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }

  mapChatHistoryToRole(): { role: ChatCompletionRequestMessageRoleEnum; content: string }[] {
    return this.chatHistory.map((item) => ({
      role: item.type === 'user' ? ChatCompletionRequestMessageRoleEnum.User : ChatCompletionRequestMessageRoleEnum.Assistant,
      content: item.message,
    }));
  }

  setProfileDataDummy() {
    return {
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

  setOnConversationImportedCallback(callback: () => void): void {
    this.onConversationImportedCallback = callback;
  }

  conversationImported(): void {
    if (this.onConversationImportedCallback) {
      this.onConversationImportedCallback();
    }
  }
}
