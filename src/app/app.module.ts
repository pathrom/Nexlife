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
import { DevModeService } from './services/devMode.service';
import { SettingsService } from './services/settings.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WhatsappParserService } from './services/whatsapp-parser.service';
import { OpenAIService } from './services/openai.service';
import { HttpClientModule } from '@angular/common/http';
import { LottieComponent } from './components/lottie/lottie.component';
import { LoadingService } from './services/loading.service';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [AppComponent, ChatgptComponent, PrivacyPolicyComponent, HomeComponent, FormInitialComponent, WhatsappImportComponent, DevModeComponent, LottieComponent, LoadingComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, FormsModule, CommonModule, SharedModule, AppLayoutModule, HttpClientModule],
  providers: [AuthenticationService, SweetAlert2Module, DataInfoService, DevModeService, SettingsService, MessageService, WhatsappParserService, OpenAIService, LoadingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
