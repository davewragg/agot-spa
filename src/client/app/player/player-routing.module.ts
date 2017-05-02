import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewPlayerPageComponent } from './player.container';
import { PlayerExistsGuard } from '../state-management/guards/player-exists';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'players/:id',
        component: ViewPlayerPageComponent,
        canActivate: [PlayerExistsGuard],
      },
    ])
  ],
  exports: [RouterModule]
})
export class PlayerRoutingModule {
}
