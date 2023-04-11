import { NgModule } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
    return player;
}

@NgModule({
    imports: [LottieModule.forRoot({ player: playerFactory })],
    exports: [LottieModule],

    declarations: [],
})
export class LottiesModule {}
