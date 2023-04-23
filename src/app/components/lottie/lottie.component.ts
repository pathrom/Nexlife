import { Component, Input } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-lottie',
  templateUrl: './lottie.component.html',
  styleUrls: ['./lottie.component.scss'],
})
export class LottieComponent {
  @Input() callFirstTime: string;

  options: AnimationOptions = {
    path: '/assets/lotties/load.json',
  };

  styles: Partial<CSSStyleDeclaration> = {
    width: '40vw',
  };

  constructor() {}
}
