import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatgptComponent } from './components/chatgpt/chatgpt.component';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: ChatgptComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
