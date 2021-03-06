import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from '../shared/services/player.service';
import { Player } from '../shared/models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-all-players',
  templateUrl: 'players.component.html',
})
export class PlayersComponent {
  players: Observable<Player[]>;
  isLoading: boolean;

  constructor(private _playerService: PlayerService) {
    this.loadPlayers();
  }

  loadPlayers() {
    this.isLoading = true;
    this.players = this._playerService.getPlayers();
    this.players.filter((x) => !!x && !!x.length).subscribe(
      () => this.isLoading = false,
      () => this.isLoading = false,
      () => this.isLoading = false
    );
  }
}
