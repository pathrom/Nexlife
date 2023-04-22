import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion'; //accordion and accordion tab
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { PasswordModule } from 'primeng/password';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { StepsModule } from 'primeng/steps';
const PrimeNG = [
  ChartModule,
  DividerModule,
  TableModule,
  StyleClassModule,
  AccordionModule,
  PanelModule,
  CardModule,
  ButtonModule,
  DropdownModule,
  InputTextModule,
  InputTextareaModule,
  CheckboxModule,
  RadioButtonModule,
  MessagesModule,
  MessageModule,
  ToolbarModule,
  MenubarModule,
  InputSwitchModule,
  TieredMenuModule,
  SidebarModule,
  OverlayPanelModule,
  AvatarGroupModule,
  PanelMenuModule,
  MenuModule,
  PasswordModule,
  SplitButtonModule,
  ProgressSpinnerModule,
  ConfirmDialogModule,
  DialogModule,
  BreadcrumbModule,
  TabViewModule,
  DynamicDialogModule,
  FileUploadModule,
  ToastModule,
  SelectButtonModule,
  KeyFilterModule,
  StepsModule,
];

@NgModule({
  declarations: [],
  imports: [PrimeNG],
  exports: [PrimeNG],
})
export class PrimeNGModule {}
