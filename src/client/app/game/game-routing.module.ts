import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameDetailsComponent } from './game-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '/games/new', component: GameDetailsComponent },
      { path: '/games/:id', component: GameDetailsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class GameRoutingModule {
}
