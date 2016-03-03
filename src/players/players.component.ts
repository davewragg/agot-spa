import {Component, OnInit} from 'angular2/core';

import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerLinkComponent} from '../shared/components/player-link.component';

@Component({
  selector: 'agot-all-players',
  moduleId: module.id,
  viewProviders: [PlayerService],
  templateUrl: './players.html',
  directives: [PlayerLinkComponent]
})
export class PlayersComponent implements OnInit {
  players:Player[];
  loadingError:any = null;

  constructor(private _playerService:PlayerService) {
  }

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    // TODO async
    this.players = this._playerService.getPlayers();
      //.subscribe(
      //  (data) => {
      //    this.loadingError = null;
      //    this.allResults = data.allResults;
      //    this.seasons = data.seasons;
      //  },
      //  (err) => {
      //    this.loadingError = err._body || err;
      //  },
      //  () => console.log('done')
      //);
  }
}
