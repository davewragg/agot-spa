import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { Player } from '../models/player.model';

@Injectable()
export class PlayerService {
  private _data: Observable<Player[]>;
  private _currentPlayerData: Observable<Player>;

  constructor(private _dataService: DataService) {
  }

  getPlayers() {
    if (!this._data) {
      this._data = this._getPlayers();
    }
    return this._data;
  }

  getPlayer(playerId: string): Observable<Player> {
    return this.getPlayers().map((players: Player[]) => players.find((player: Player) => player.playerId === playerId));
  }

  getCurrentPlayer() {
    if (!this._currentPlayerData) {
      this._currentPlayerData = this._getCurrentPlayer();
    }
    return this._currentPlayerData;
  }

  private _getPlayers(): Observable<Player[]> {
    console.log('_getPlayers called');
    return this._dataService.getPlayers()
      .publishReplay(1).refCount();
  }

  private _getCurrentPlayer(): Observable<Player> {
    console.log('_getCurrentPlayer called');
    return this._dataService.getCurrentPlayer()
      .publishReplay(1).refCount();
  }
}
