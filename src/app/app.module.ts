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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WhatsappImportComponent } from './components/whatsapp-import/whatsapp-import.component';
import { DevModeComponent } from './components/dev-mode/dev-mode.component';
import { DataInfoService } from './services/dataInfo.service';
import { SettingsService } from './services/settings.service';
import { MessageService } from 'primeng/api';
import { WhatsappImportService } from './services/whatsapp-import.service';
import { OpenAIService } from './services/openai.service';
import { HttpClientModule } from '@angular/common/http';
import { LottieComponent } from './components/lottie/lottie.component';
import { LoadingService } from './services/loading.service';
import { LoadingComponent } from './components/loading/loading.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';

@NgModule({
  declarations: [AppComponent, ChatgptComponent, PrivacyPolicyComponent, HomeComponent, FormInitialComponent, WhatsappImportComponent, DevModeComponent, LottieComponent, LoadingComponent, ChatMessageComponent, ChatInputComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, FormsModule, CommonModule, SharedModule, AppLayoutModule, HttpClientModule],
  providers: [AuthenticationService, SweetAlert2Module, DataInfoService, SettingsService, MessageService, WhatsappImportService, OpenAIService, LoadingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
