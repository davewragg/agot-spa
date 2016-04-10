import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {PlayerStats} from '../shared/models/player-stats.model';
import {Player} from '../shared/models/player.model';
import {CountComponent} from '../shared/components/count.component';
import {StatsTableComponent} from './stats-table.component';
import {PlayerInsightsComponent} from './player-insights.component';
import {GamesTableComponent} from '../home/components/games-table.component';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'agot-player-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './players/player-stats.html',
  directives: [
    ROUTER_DIRECTIVES,
    CountComponent,
    StatsTableComponent,
    PlayerInsightsComponent,
    GamesTableComponent
  ]
})
export class PlayerStatsComponent {
  @Input()
  player:Player;
  @Input()
  playerStats:PlayerStats;

  showGames:boolean = false;
}
