import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RankingsComponent } from './rankings.component';
import { AllRankingsComponent } from './all-rankings.component';
import { RankingsRoutingModule } from './rankings-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, RankingsRoutingModule],
  declarations: [RankingsComponent, AllRankingsComponent],
  // exports: [RankingsComponent, AllRankingsComponent]
})
export class RankingsModule {
}
