import { Injectable } from '@angular/core';
import { DataInfoService } from './dataInfo.service';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private dataInfSv: DataInfoService) {}

  resetHistoryChat(): void {
    localStorage.removeItem('chatHistory');
    this.dataInfSv.chatHistory = [];
    this.dataInfSv.saveChatHistory();
  }
}
