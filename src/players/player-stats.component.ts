import {Component, OnInit, Input, ChangeDetectionStrategy} from 'angular2/core';
import {PlayerService} from '../shared/services/player.service';
import {PlayerStats} from '../shared/models/player-stats.model';
import {Player} from '../shared/models/player.model';

@Component({
  selector: 'agot-player-stats',
  moduleId: module.id,
  templateUrl: './player-stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerStatsComponent implements OnInit {
  @Input()
  player:Player;
  @Input()
  playerStats:PlayerStats;

  players:Player[];

  constructor(private _playerService:PlayerService) {
  }

  ngOnInit() {
    console.log(this.playerStats);
  }
}
