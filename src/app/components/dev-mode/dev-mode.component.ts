import { Component } from '@angular/core';
import { DevModeService } from './../../services/devMode.service';
import { ChatgptComponent } from '../chatgpt/chatgpt.component';
import { DataInfoService } from 'src/app/services/dataInfo.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dev-mode',
  templateUrl: './dev-mode.component.html',
  styleUrls: ['./dev-mode.component.scss'],
})
export class DevModeComponent {
  constructor(public svDvMod: DevModeService, public chatComponent: ChatgptComponent, public svDataInfo: DataInfoService, public sttgs: SettingsService) {}
}
