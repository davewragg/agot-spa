import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';

@Component({
  selector: 'agot-all-players',
  moduleId: module.id,
  viewProviders: [PlayerService],
  template: `
    <h2>Players</h2>
    <div *ngFor="#player of players">
      <a [routerLink]="['/PlayerDetails', {id: player.playerId}]">{{ player.name }}</a>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
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
