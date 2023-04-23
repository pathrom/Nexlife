import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { OpenAIService } from 'src/app/services/openai.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WhatsappParserService } from 'src/app/services/whatsapp-parser.service';

@Component({
  selector: 'app-whatsapp-import',
  templateUrl: './whatsapp-import.component.html',
  styleUrls: ['./whatsapp-import.component.scss'],
})
export class WhatsappImportComponent {
  displayDialog: boolean = false;
  people: string[] = [];
  messages: any;

  constructor(private messageService: MessageService, private whatsappSv: WhatsappParserService, private dataInfSv: DataInfoService, private sttgs: SettingsService, private openAi: OpenAIService) {}

  onUpload(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result as string;
      this.messages = this.whatsappSv.parseFileContent(content);
      this.people = this.extractPeopleFromMessages(this.messages);
      this.displayDialog = true;
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded and Parsed' });
    };

    reader.readAsText(file);
  }

  async processImportWhatsapp(person) {
    this.messages = await this.filterMessagesByPerson(person);
    this.messages = await this.whatsappSv.filterMessage(this.messages);
    this.messages = await this.frecuencyPhrases();
    // const summarizedText = await this.summarizeText();

    await this.saveConverWhatsapp();
  }

  extractPeopleFromMessages(messages: any[]): string[] {
    const peopleSet = new Set<string>();
    messages.forEach((message) => peopleSet.add(message.sender));
    return Array.from(peopleSet);
  }

  async filterMessagesByPerson(person: string) {
    this.displayDialog = false;
    return this.messages.filter((message) => message.sender === person); // Filtrar mensajes por la persona seleccionada
  }

  async frecuencyPhrases() {
    const messages = this.messages.map((message) => message.content);
    const phraseOccurrences = this.whatsappSv.countPhraseOccurrences(messages);
    const totalMessages = messages.length;
    const weightedPhrases = this.whatsappSv.getWeightedPhrases(phraseOccurrences, totalMessages);
    const formattedText = `Common phrases and their frequency:\n${weightedPhrases.join('\n')}`;
    return formattedText.split('\n');
  }

  async saveConverWhatsapp() {
    this.dataInfSv.converWhatsapp = this.messages;
    this.dataInfSv.conversationImported();
  }

  async summarizeText() {
    const model = 'gpt-3.5-turbo';
    const instructions: any = [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes text but not too much and mantains the main idea and format.',
      },
      {
        role: 'user',
        content: `Please summarize the following text: ${this.messages}`,
      },
    ];

    this.messages = this.openAi.sendChatGpt(instructions, model);
  }
}
