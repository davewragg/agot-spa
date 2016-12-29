import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { Player } from '../models/player.model';

@Injectable()
export class PlayerService {
  private _data: Observable<Player[]>;

  constructor(private _dataService: DataService) {
  }

  getPlayers() {
    if (!this._data) {
      this._data = this._getPlayers();
    }
    return this._data;
  }

  getPlayer(playerId: number): Observable<Player> {
    return this.getPlayers().map((players: Player[]) => players.find((player: Player) => player.playerId === playerId));
  }

  private _getPlayers(): Observable<Player[]> {
    console.log('_getPlayers called');
    return this._dataService.getReferenceData('players', 'includeMostPlayedFaction=true')
      .share();
  }
}
