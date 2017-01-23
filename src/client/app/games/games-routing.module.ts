import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GamesContainerComponent } from './games.container';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'games', component: GamesContainerComponent }
    ])
  ],
  exports: [RouterModule]
})
export class GamesRoutingModule {
}
