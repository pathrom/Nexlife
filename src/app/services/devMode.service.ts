import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DevModeService {
  isDevMode: boolean = false;

  constructor() {}
}
