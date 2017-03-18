import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameExistsGuard } from '../state-management/guards/game-exists';
import { ViewGamePageComponent } from './game.container';
import { EditGamePageComponent } from './edit-game.container';
import { CreateGamePageComponent } from './create-game.container';
import { GameIsDirtyGuard } from '../state-management/guards/game-is-dirty';
import { CanEditGameGuard } from '../state-management/guards/game-can-edit';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'games/new',
        component: CreateGamePageComponent,
        canDeactivate: [GameIsDirtyGuard],
      },
      {
        path: 'games/:id',
        component: ViewGamePageComponent,
        canActivate: [GameExistsGuard],
      },
      {
        path: 'games/:id/edit',
        component: EditGamePageComponent,
        canActivate: [CanEditGameGuard, GameExistsGuard],
        canDeactivate: [GameIsDirtyGuard],
      },
    ])
  ],
  exports: [RouterModule]
})
export class GameRoutingModule {
}
