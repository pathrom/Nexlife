import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatgptComponent } from './chatgpt/chatgpt.component';

const routes: Routes = [
  {
    path: 'chatgpt',
    component: ChatgptComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
