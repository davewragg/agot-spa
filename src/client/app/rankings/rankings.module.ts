import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RankingsComponent } from './rankings.component';
import { AllRankingsComponent } from './all-rankings.component';

@NgModule({
  imports: [CommonModule, SharedModule], // TODO RankingsRoutingModule
  declarations: [RankingsComponent, AllRankingsComponent],
  exports: [RankingsComponent, AllRankingsComponent]
})
export class RankingsModule {
}
