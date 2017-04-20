import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerGroupPageComponent } from './group.container';
import { PlayerGroupExistsGuard } from '../state-management/guards/group-exists';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'groups/new',
        component: PlayerGroupPageComponent,
      },
      {
        path: 'groups/:id',
        component: PlayerGroupPageComponent,
        canActivate: [PlayerGroupExistsGuard],
      },
    ])
  ],
  exports: [RouterModule]
})
export class PlayerGroupRoutingModule {
}
