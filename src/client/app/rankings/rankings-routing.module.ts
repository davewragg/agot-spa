import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RankingsContainerComponent } from './rankings.container';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'rankings', component: RankingsContainerComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RankingsRoutingModule {
}
