import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class WhatsappParserService {
  constructor() {}

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
}
