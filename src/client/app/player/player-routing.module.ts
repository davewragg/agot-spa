import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerDetailsComponent } from './player-details.component';
import { NewPlayerDetailsComponent } from './new-player-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'players/:id', component: PlayerDetailsComponent },
      { path: 'players/:id/new', component: NewPlayerDetailsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class PlayerRoutingModule {
}
