import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataInfoService {
  costMsg = '';
  converWhatsapp: any = [];

  private onConversationImportedCallback: () => void;

  constructor() {}

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
