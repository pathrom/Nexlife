import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { DataInfoService } from 'src/app/services/dataInfo.service';
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

  constructor(private messageService: MessageService, private whatsappParserService: WhatsappParserService, private dataInfSv: DataInfoService, private sttgs: SettingsService) {}

  onUpload(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result as string;
      this.messages = this.whatsappParserService.parseFileContent(content);
      this.people = this.extractPeopleFromMessages(this.messages);
      this.displayDialog = true;
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded and Parsed' });
    };

    reader.readAsText(file);
  }
  extractPeopleFromMessages(messages: any[]): string[] {
    const peopleSet = new Set<string>();
    messages.forEach((message) => peopleSet.add(message.sender));
    return Array.from(peopleSet);
  }

  async filterMessagesByPerson(person: string) {
    this.displayDialog = false;

    // Filtrar mensajes por la persona seleccionada
    this.messages = this.messages.filter((message) => message.sender === person);

    // Eliminar elementos no deseados de los mensajes
    this.messages = this.messages.map((message) => {
      const content = message.content;

      // Eliminar URLs
      const urlRegex = /https?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g;
      const cleanedContent = content.replace(urlRegex, '');

      // Eliminar correos electrónicos
      const emailRegex = /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/g;
      const noEmailContent = cleanedContent.replace(emailRegex, '');

      // Eliminar mensajes que contentgan esto
      const multimediaRegex = /<Multimedia omitido>|Videollamada grupal perdida|Llamada grupal perdida|Llamada perdida|Videollamada perdida|Se eliminó este mensaje./g;
      const noMultimediaContent = noEmailContent.replace(multimediaRegex, '');

      // Eliminar elementos de fecha, hora y remitente
      const dateRegex = /\\d{1,2}\/\\d{1,2}\/\\d{2,4}, \\d{1,2}:\\d{2} (?:AM|PM) - /g;
      const noDateContent = noMultimediaContent.replace(dateRegex, '');

      // Eliminar espacios en blanco al principio y al final
      const trimmedContent = noDateContent.trim();

      // Eliminar líneas vacías
      const noEmptyLinesContent = trimmedContent.replace(/\\n\\n/g, '\\n');

      // Eliminar espacios en blanco adicionales
      const noExtraSpacesContent = noEmptyLinesContent.replace(/\\n\\s+/g, '\\n');

      //  Eliminar emojis
      const emojiRegex = /\\p{Emoji}/g;
      const noEmojiContent = noExtraSpacesContent.replace(emojiRegex, '');

      // Eliminar texto que no es alfanumérico
      const noAlphaNumericContent = noEmojiContent.replace(/[^a-zA-Z0-9\\s]/g, '');

      // Eliminar texto de 1 caracter
      const noOneCharContent = noAlphaNumericContent.replace(/\\b\\w{1}\\b/g, '');

      // Eliminar texto de 2 caracteres
      const noTwoCharContent = noOneCharContent.replace(/\\b\\w{2}\\b/g, '');

      // Eliminar líneas que contengan solo números
      const noNumberContent = noTwoCharContent.replace(/\\b\\d+\\b/g, '');

      // Obtener modismos y su frecuencia

      return {
        content: noNumberContent,
      };
    });

    // Eliminar mensajes vacíos después de la limpieza
    this.messages = this.messages.filter((message) => message.content.length > 0);

    await this.filterAndSumarize();
    await this.sendToIndoSaveService();
    // await this.showCostAndCharacterCount(); // Mostrar el conteo de caracteres y el costo
  }

  async filterAndSumarize() {
    const messages = this.messages.map((message) => message.content);
    const phraseOccurrences = this.countPhraseOccurrences(messages);
    console.log('🚀 ~ WhatsappImportComponent ~ filterAndSumarize ~ phraseOccurrences:', phraseOccurrences);
    const totalMessages = messages.length;

    // const summarizedText = await this.summarizeText(messages.join('\n'));

    const weightedPhrases = this.getWeightedPhrases(phraseOccurrences, totalMessages);
    console.log('🚀 ~ WhatsappImportComponent ~ filterAndSumarize ~ weightedPhrases:', weightedPhrases);

    const formattedText = `Common phrases and their frequency:\n${weightedPhrases.join('\n')}`;
    this.messages = formattedText.split('\n');
    console.log('🚀 ~ WhatsappImportComponent ~ filterAndSumarize ~ this.messages:', this.messages);
  }

  getWeightedPhrases(phraseOccurrences: Map<string, number>, totalMessages: number): string[] {
    const weightedPhrases = Array.from(phraseOccurrences.entries())
      .map(([phrase, count]) => ({
        phrase,
        weight: count / totalMessages,
      }))
      .sort((a, b) => b.weight - a.weight);

    // return weightedPhrases.map((entry) => `${entry.phrase} (frequency: ${entry.weight.toFixed(3)})`);
    return weightedPhrases.map((entry) => `${entry.phrase}`);
  }

  countPhraseOccurrences(messages: string[]): Map<string, number> {
    const phraseMap = new Map<string, number>();

    messages.forEach((message) => {
      if (phraseMap.has(message)) {
        phraseMap.set(message, phraseMap.get(message) + 1);
      } else {
        phraseMap.set(message, 1);
      }
    });

    return phraseMap;
  }
  async sendToIndoSaveService() {
    this.dataInfSv.converWhatsapp = this.messages;
    this.dataInfSv.conversationImported();
  }

  async summarizeText(text: string): Promise<string> {
    const model = 'gpt-3.5-turbo';

    const response = await this.sttgs.openAi.createChatCompletion({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes text but not too much and mantains the main idea and format.',
        },
        {
          role: 'user',
          content: `Please summarize the following text: ${text}`,
        },
      ],
    });

    const summary = response.data.choices[0].message.content;
    return summary;
  }

  showCostAndCharacterCount() {
    if (this.messages) {
      const characterCount = this.messages.reduce((count, message) => count + message.content.length, 0);
      const tokenCount = Math.ceil(characterCount / 700); // asumimos que 700 caracteres son 1000 tokens
      const costPer1000Tokens = 0.002; // 0.002 centimos por 1000 tokens
      const cost = tokenCount * costPer1000Tokens;

      // Mostrar el conteo de caracteres y el costo en un mensaje emergente
      this.messageService.add({
        severity: 'info',
        summary: 'Character Count and Cost',
        detail: `Total characters: ${characterCount}, Cost: €${cost.toFixed(4)}`,
      });

      // Mostrar el conteo de caracteres y el costo en la consola
      console.log(`Total characters: ${characterCount}, Cost: €${cost.toFixed(4)}`);
      this.dataInfSv.getTokensUsedCost(tokenCount);
    }
  }
}
