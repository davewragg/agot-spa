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
      .map(this.mapPlayerGroupAdmin.bind(this))
      .publishReplay(1).refCount();
  }

  private mapPlayerGroupAdmin(player: Player) {
    let adminGroupIds: number[] = [];
    const playerGroups = player.playerGroups.map((group: any) => {
      if (group.isUserGroupAdmin) {
        adminGroupIds.push(group.playerGroup.id);
      }
      return group.playerGroup;
    });
    return Object.assign({}, player, {
      playerGroups,
      adminGroupIds,
    });
  }
}
