import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AllRankingsComponent } from './all-rankings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'rankings', component: AllRankingsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RankingsRoutingModule {
}
