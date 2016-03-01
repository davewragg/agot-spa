import {Component, OnInit} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerStats} from '../shared/models/player-stats.model';

@Component({
  selector: 'agot-player-details',
  moduleId: module.id,
  viewProviders: [PlayerService],
  templateUrl: './player-details.html',
  //styleUrls: ['./player-details.css']
  directives: [ROUTER_DIRECTIVES]
})
export class PlayerDetailsComponent implements OnInit {
  player:Player;
  playerStats:PlayerStats;
  playerIdParam:number;

  constructor(params:RouteParams,
              private _playerService:PlayerService) {
    this.playerIdParam = <number>+params.get('id');
  }

  ngOnInit() {
    if (this.playerIdParam) {
      this.player = this._playerService.getPlayer(this.playerIdParam);
      this._playerService.getPlayerStats(this.playerIdParam)
        .subscribe((stats) => {
          this.playerStats = stats;
        });
    }
  }
}
