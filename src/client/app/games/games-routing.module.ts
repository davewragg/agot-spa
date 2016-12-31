import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GamesComponent } from './games.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'games', component: GamesComponent }
      // {path: '/games/new', component: GameDetailsComponent, name: 'NewGameDetails'},
      // {path: '/games/:id', component: GameDetailsComponent, name: 'GameDetails'},
    ])
  ],
  exports: [RouterModule]
})
export class GamesRoutingModule {
}
