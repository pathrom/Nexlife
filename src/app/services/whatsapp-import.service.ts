import { Injectable } from '@angular/core';
import { DataInfoService } from './dataInfo.service';
import { OpenAIService } from './openai.service';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class WhatsappImportService {
  showWhatsappImport = false;

  constructor(private dataInfSv: DataInfoService, private openAi: OpenAIService) {}

  async importedConversation(): Promise<void> {
    console.log('IMPORTED CONVERSATION');
    const firstMessageIndex = this.dataInfSv.chatHistory.findIndex((item) => item.type === 'user' || item.type === 'bot');
    const insertIndex = firstMessageIndex === -1 ? 0 : firstMessageIndex;
    const message = '##########\nTake this conversation as context and acquire this personality based on the frequency of words this person uses and try to imitate them as well as possible:\n' + this.dataInfSv.converWhatsapp + '\n########## No response needed, only context';
    this.dataInfSv.chatHistory.splice(insertIndex, 0, {
      message: message,
      type: 'bot',
      hidden: true,
    });

    this.dataInfSv.saveChatHistory();
    this.showWhatsappImport = false;

    const model = 'gpt-3.5-turbo';
    const role = ChatCompletionRequestMessageRoleEnum.Assistant;
    const instructions = [
      {
        role: role,
        content: message,
      },
      ...this.dataInfSv.mapChatHistoryToRole(),
    ];

    await this.openAi.sendChatGpt(instructions, model);
  }

  parseFileContent(content: string) {
    const messages = content.split(/\n/).map((line) => {
      const match = line.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})\s-\s(.*?):\s(.*)/);
      if (match) {
        return {
          date: match[1],
          time: match[2],
          sender: match[3],
          content: match[4],
        };
      } else {
        return {};
      }
    });
    return messages.filter((msg) => Object.keys(msg).length !== 0);
  }

  async filterMessage(message) {
    // Eliminar elementos no deseados de los mensajes
    message = message.map((msg) => {
      const content = msg.content;

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

      // Eliminar líneas vacías
      const noEmptyLinesContent = noDateContent.replace(/\\n\\n/g, '\\n');

      //  Eliminar emojis
      const emojiRegex = /\\p{Emoji}/g;
      const noEmojiContent = noEmptyLinesContent.replace(emojiRegex, '');

      return {
        content: noEmojiContent,
      };
    });

    // Eliminar mensajes vacíos después de la limpieza
    message = message.filter((message) => message.content.length > 0);

    return message;
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
}
