import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PlayerStats } from '../shared/models/player-stats.model';
import { Player } from '../shared/models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'player-stats.component.html',
})
export class PlayerStatsComponent {
  @Input()
  player: Player;
  @Input()
  playerStats: PlayerStats;

  showGames: boolean = false;
}
