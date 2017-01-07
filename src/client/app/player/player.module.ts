import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GamesModule } from '../games/games.module';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerDetailsComponent } from './player-details.component';
import { PlayerInsightsComponent } from './player-insights.component';
import { PlayerStatsComponent } from './player-stats.component';

@NgModule({
  imports: [CommonModule, SharedModule, PlayerRoutingModule, GamesModule],
  declarations: [
    PlayerDetailsComponent,
    PlayerInsightsComponent,
    PlayerStatsComponent,
  ],
  // exports: [PlayersTableComponent, PlayersComponent]
})
export class PlayerModule {
}
