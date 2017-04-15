import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { Player } from '../models/player.model';
import { CacheService } from './cache.service';
import { FilterCriteria } from '../models/filter-criteria.model';

@Injectable()
export class PlayerService {
  private _currentPlayerData: Observable<Player>;

  constructor(private dataService: DataService,
              private cacheService: CacheService) {
  }

  getPlayers(playerGroupId?: number) {
    const criteria = new FilterCriteria();
    criteria.playerGroupIds = [playerGroupId];
    return this.cacheService.getFilteredData('players', this.dataService.getPlayers, criteria, this.dataService);
  }

  getPlayer(playerId: string): Observable<Player> {
    return this.dataService.getPlayer(playerId);
  }

  getCurrentPlayer() {
    if (!this._currentPlayerData) {
      this._currentPlayerData = this._getCurrentPlayer();
    }
    return this._currentPlayerData;
  }

  private _getCurrentPlayer(): Observable<Player> {
    console.log('_getCurrentPlayer called');
    return this.dataService.getCurrentPlayer()
      .publishReplay(1).refCount();
  }
}
