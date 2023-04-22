import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  chat(completion: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `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`,
    };

    return this.http.post<any>(this.apiUrl, completion, { headers });
  }
}
