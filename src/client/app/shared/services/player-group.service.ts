import { Injectable } from '@angular/core';
import { PlayerGroup } from '../models/player-group.model';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { playerGroupStorage } from './player-group-storage';

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

  getSelectedPlayerGroupId(): Observable<number> {
    return Observable.of(this.getFromLocal() || null);
  }

  setSelectedPlayerGroupId(playerGroupId: number): Observable<void> {
    return Observable.of(this.setToLocal(playerGroupId));
  }

  private getFromLocal() {
    console.log('get selected player group id from local storage');
    return playerGroupStorage.getPlayerGroupId();
  }

  private setToLocal(playerGroupId: number) {
    console.log('set selected player group id to local storage', playerGroupId);
    return playerGroupStorage.setPlayerGroupId(playerGroupId);
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
