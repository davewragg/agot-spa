import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerDetailsComponent } from './player-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'players/:id', component: PlayerDetailsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class PlayerRoutingModule {
}
