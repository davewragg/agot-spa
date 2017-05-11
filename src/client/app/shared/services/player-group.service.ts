import { Injectable } from '@angular/core';
import { PlayerGroup } from '../models/player-group.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
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
    return of(this.getFromLocal() || null);
  }

  setSelectedPlayerGroupId(playerGroupId: number): Observable<void> {
    return of(this.setToLocal(playerGroupId));
  }

  joinPlayerGroup(playerGroup: PlayerGroup): Observable<PlayerGroup> {
    return this.dataService.joinPlayerGroup(playerGroup);
  }

  updatePlayerGroup(playerGroup: PlayerGroup): Observable<PlayerGroup> {
    if (playerGroup.id) {
      return this.dataService.updatePlayerGroup(playerGroup);
    } else {
      return this.dataService.createPlayerGroup(playerGroup);
    }
  }

  private getFromLocal() {
    console.log('get selected player group id from local storage');
    return playerGroupStorage.getPlayerGroupId();
  }

  private setToLocal(playerGroupId: number) {
    console.log('set selected player group id to local storage', playerGroupId);
    return playerGroupStorage.setPlayerGroupId(playerGroupId);
  }
}
