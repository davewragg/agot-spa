import { Injectable } from '@angular/core';
import { PlayerGroup } from '../models/player-group.model';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';

@Injectable()
export class PlayerGroupService {

  constructor(private dataService: DataService) {
  }

  getPlayerGroups(): Observable<PlayerGroup[]> {
    return this.dataService.getPlayerGroups();
  }

  getPlayerGroup(playerGroupId: number): Observable<PlayerGroup> {
    return this.dataService.getPlayerGroup(playerGroupId);
  }

  // updatePlayerGroup(playerGroup: PlayerGroup): Observable<PlayerGroup> {
  //   this.cacheService.invalidate();
  //   if (playerGroup.id) {
  //     return this.dataService.updatePlayerGroup(playerGroup);
  //   } else {
  //     return this.dataService.createPlayerGroup(playerGroup);
  //   }
  // }

  // deletePlayerGroup(playerGroupId: number): Observable<any> {
  //   this.cacheService.invalidate();
  //   return this.dataService.deletePlayerGroup(playerGroupId);
  // }
}
