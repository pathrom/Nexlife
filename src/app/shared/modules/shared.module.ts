import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimeNGModule } from './primeng.module';
import { MaterialModule } from './material.module';
import { LottiesModule } from './lottie.module';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PrimeNGModule,
    MaterialModule,
    LottiesModule,
  ],
})
export class SharedModule {}
