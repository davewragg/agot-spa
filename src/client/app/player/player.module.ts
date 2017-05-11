import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerDetailsComponent } from './player-details.component';
import { PlayerInsightsComponent } from './player-insights.component';
import { PlayerStatsComponent } from './player-stats.component';
import { ViewPlayerPageComponent } from './player.container';
import { PlayerExistsGuard } from '../state-management/guards/player-exists';

@NgModule({
  imports: [CommonModule, SharedModule, PlayerRoutingModule],
  declarations: [
    PlayerDetailsComponent,
    PlayerInsightsComponent,
    PlayerStatsComponent,
    ViewPlayerPageComponent,
  ],
  providers: [
    PlayerExistsGuard,
  ]
  // exports: [PlayersTableComponent, PlayersComponent]
})
export class PlayerModule {
}
