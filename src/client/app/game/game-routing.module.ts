import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameDetailsComponent } from './game-details.component';
import { CreateGameComponent } from './create-game.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'games/new', component: CreateGameComponent },
      { path: 'games/:id', component: GameDetailsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class GameRoutingModule {
}
