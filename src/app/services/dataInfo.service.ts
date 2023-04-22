import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class DataInfoService {
  costMsg = '';

  constructor(private sttngs: SettingsService) {}

  getTokensUsedCost(tokensUsed: number): void {
    const COST_PER_TOKEN = this.sttngs.versionGPT === '4' ? 0.00008 : 0.000002;
    const cost = tokensUsed * COST_PER_TOKEN;
    this.costMsg = `Tokens used: ${tokensUsed} \n Cost: ${cost.toFixed(4)}`;
  }
}
