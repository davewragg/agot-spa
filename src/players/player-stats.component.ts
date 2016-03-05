import {Component, OnInit, Input, ChangeDetectionStrategy} from 'angular2/core';
import {PlayerService} from '../shared/services/player.service';
import {PlayerStats} from '../shared/models/player-stats.model';
import {Player} from '../shared/models/player.model';
import {CountComponent} from '../shared/components/count.component';
import {PlayerStatsTableComponent} from './player-stats-table.component';

@Component({
  selector: 'agot-player-stats',
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './player-stats.html',
  directives: [CountComponent, PlayerStatsTableComponent]
})
export class PlayerStatsComponent implements OnInit {
  @Input()
  player:Player;
  @Input()
  playerStats:PlayerStats;

  constructor(private _playerService:PlayerService) {
  }

  ngOnInit() {
    //?
  }
}
