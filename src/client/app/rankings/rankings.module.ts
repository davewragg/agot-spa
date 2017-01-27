import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RankingsComponent } from './rankings.component';
import { AllRankingsComponent } from './all-rankings.component';
import { RankingsRoutingModule } from './rankings-routing.module';
import { PlayerResultsFormComponent } from './player-results-form/player-results-form.component';
import { RankingsContainerComponent } from './rankings.container';

@NgModule({
  imports: [CommonModule, SharedModule, RankingsRoutingModule],
  declarations: [RankingsComponent, AllRankingsComponent, PlayerResultsFormComponent, RankingsContainerComponent],
  exports: [AllRankingsComponent]
})
export class RankingsModule {
}
