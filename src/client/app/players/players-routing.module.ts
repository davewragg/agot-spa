import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayersContainerComponent } from './players.container';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'players', component: PlayersContainerComponent },
      { path: 'players/:id', component: PlayersContainerComponent },
    ])
  ],
  exports: [RouterModule]
})
export class PlayersRoutingModule {
}
