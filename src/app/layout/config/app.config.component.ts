import { Component, Input } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html',
})
export class AppConfigComponent {
  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];
  theme: string;
  checked: boolean;
  colorScheme;

  constructor(public layoutService: LayoutService, public auth: AuthenticationService) {
    this.checkThemeModeSaved();
  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }

  set scale(_val: number) {
    this.layoutService.config.scale = _val;
  }

  get menuMode(): string {
    return this.layoutService.config.menuMode;
  }

  set menuMode(_val: string) {
    this.layoutService.config.menuMode = 'static';
  }

  get inputStyle(): string {
    return 'filled';
  }

  set inputStyle(_val: string) {
    this.layoutService.config.inputStyle = 'filled';
  }

  get ripple(): boolean {
    return this.layoutService.config.ripple;
  }

  set ripple(_val: boolean) {
    this.layoutService.config.ripple = _val;
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  checkThemeModeSaved() {
    if (localStorage.getItem('theme') === null) {
      this.theme = 'mdc-dark-deeppurple';
      this.colorScheme = 'dark';
    } else {
      this.theme = localStorage.getItem('theme');
      this.colorScheme = localStorage.getItem('colorScheme');
    }

    if (this.colorScheme === 'dark') {
      this.checked = true;
    } else {
      this.checked = false;
    }

    localStorage.setItem('theme', this.theme);
    localStorage.setItem('colorScheme', this.colorScheme);
    this.setThemeMode(this.theme, this.colorScheme);
  }

  changeTheme(event) {
    if (event.checked) {
      this.theme = 'mdc-dark-deeppurple';
      this.colorScheme = 'dark';
    } else {
      this.theme = 'mdc-light-deeppurple';
      this.colorScheme = 'light';
    }
    localStorage.setItem('theme', this.theme);
    localStorage.setItem('colorScheme', this.colorScheme);

    this.setThemeMode(this.theme, this.colorScheme);
  }

  setThemeMode(theme, colorScheme) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);

    this.replaceThemeLink(newHref, () => {
      this.layoutService.config.theme = theme;
      this.layoutService.config.colorScheme = colorScheme;
      this.layoutService.onConfigUpdate();
    });
  }

  replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }
}
