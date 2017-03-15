import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameDetailsComponent } from './game-details.component';
import { CreateGameComponent } from './create-game.component';
import { GameExistsGuard } from '../state-management/guards/game-exists';
import { ViewGamePageComponent } from './game.container';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'games/new', component: CreateGameComponent },
      {
        path: 'games/:id',
        component: ViewGamePageComponent,
        canActivate: [GameExistsGuard],
      },
      {
        path: 'games/:id/edit',
        component: GameDetailsComponent,
        canActivate: [GameExistsGuard],
      },
    ])
  ],
  exports: [RouterModule]
})
export class GameRoutingModule {
}
