import { Component } from '@angular/core';
import { ChatgptComponent } from '../chatgpt/chatgpt.component';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-dev-mode',
  templateUrl: './dev-mode.component.html',
  styleUrls: ['./dev-mode.component.scss'],
})
export class DevModeComponent {
  constructor(public chatComponent: ChatgptComponent, public svDataInfo: DataInfoService, public config: SettingsService, public historicService: HistoryService) {}
}
