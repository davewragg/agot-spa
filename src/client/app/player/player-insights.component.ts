import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../shared/models/player.model';
import { PlayerInsights } from '../shared/models/player-insights.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-insights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'player-insights.component.html',
})
export class PlayerInsightsComponent {
  @Input()
  player: Player;
  @Input()
  playerInsights: PlayerInsights;
}
