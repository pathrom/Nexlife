import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatgptComponent } from './components/chatgpt/chatgpt.component';

const routes: Routes = [
  {
    path: '',
    component: ChatgptComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
