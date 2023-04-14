import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatgptComponent } from './components/chatgpt/chatgpt.component';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';
import { HomeComponent } from './components/home/home.component';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'chat',
        component: ChatgptComponent,
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
