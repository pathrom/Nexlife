import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatgptComponent } from './components/chatgpt/chatgpt.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/modules/shared.module';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';
import { HomeComponent } from './components/home/home.component';
import { FormInitialComponent } from './components/form-initial/form-initial.component';
import { AuthenticationService } from './layout/service/authentication.service';
import { AppLayoutModule } from './layout/app.layout.module';

@NgModule({
  declarations: [AppComponent, ChatgptComponent, PrivacyPolicyComponent, HomeComponent, FormInitialComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, FormsModule, CommonModule, SharedModule, AppLayoutModule],
  providers: [AuthenticationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
