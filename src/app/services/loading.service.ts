import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  isLoading: boolean = false;

  constructor() {}

  scrollToBottom(): void {
    setTimeout(() => {
      const messageContainerElement = document.querySelector('#chat-history');
      if (messageContainerElement) {
        messageContainerElement.scrollTop = messageContainerElement.scrollHeight;
        this.isLoading = false;
      }
    }, 100);
  }
}
