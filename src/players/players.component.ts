import {Component, OnInit} from 'angular2/core';

import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerLinkComponent} from '../shared/components/player-link.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'agot-all-players',
  moduleId: module.id,
  viewProviders: [PlayerService],
  templateUrl: './players.html',
  directives: [PlayerLinkComponent]
})
export class PlayersComponent implements OnInit {
  players:Observable<Player[]>;

  constructor(private _playerService:PlayerService) {
  }

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.players = this._playerService.players;
  }
}
