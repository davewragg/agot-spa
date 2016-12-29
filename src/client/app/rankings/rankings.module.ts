import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingsComponent } from './rankings.component';
import { AllRankingsComponent } from './all-rankings.component';

@NgModule({
  imports: [CommonModule], // TODO RankingsRoutingModule
  declarations: [RankingsComponent, AllRankingsComponent],
  exports: [RankingsComponent, AllRankingsComponent]
})
export class RankingsModule {
}
