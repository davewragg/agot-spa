import {Component, OnInit} from 'angular2/core';

import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerLinkComponent} from '../shared/components/player-link.component';
import {Observable} from 'rxjs/Observable';
import {SpinnerComponent} from '../shared/components/spinner.component';

@Component({
  selector: 'agot-all-players',
  moduleId: module.id,
  viewProviders: [PlayerService],
  templateUrl: './players.html',
  directives: [PlayerLinkComponent, SpinnerComponent]
})
export class PlayersComponent implements OnInit {
  players:Observable<Player[]>;
  isLoading:boolean;

  constructor(private _playerService:PlayerService) {
  }

  ngOnInit() {
    this.isLoading = true;
    console.log('ISLOADINGTRYE', this.isLoading);
    this.loadPlayers();
  }

  loadPlayers() {
    this.players = this._playerService.players;
    this.players.skip(1).subscribe(
      () => this.isLoading = false,
      () => this.isLoading = false,
      () => this.isLoading = false
    );
  }
}
