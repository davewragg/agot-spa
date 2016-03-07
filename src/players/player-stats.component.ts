import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {PlayerStats} from '../shared/models/player-stats.model';
import {Player} from '../shared/models/player.model';
import {CountComponent} from '../shared/components/count.component';
import {PlayerStatsTableComponent} from './player-stats-table.component';
import {PlayerInsightsComponent} from './player-insights.component';
import {GamesTableComponent} from '../home/components/games-table.component';

@Component({
  selector: 'agot-player-stats',
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './player-stats.html',
  directives: [CountComponent, PlayerStatsTableComponent, PlayerInsightsComponent, GamesTableComponent]
})
export class PlayerStatsComponent {
  @Input()
  player:Player;
  @Input()
  playerStats:PlayerStats;

  showGames:boolean = false;
}
