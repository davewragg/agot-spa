import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as fromRoot from '../reducers/root';
import { PlayerGroup } from '../../shared/models/player-group.model';
import { Player } from '../../shared/models/player.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class CanEditGroupGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
  }

  getGroup(id: number): Observable<PlayerGroup> {
    return this.store.select(fromRoot.getPlayerGroupEntities)
      .map(entities => entities[id])
      .take(1);
  }

  getCurrentPlayer(): Observable<Player> {
    return this.store.select(fromRoot.getCurrentPlayer)
      .filter(player => !!player)
      .take(1);
  }

  canEdit(id: number): Observable<boolean> {
    return combineLatest([
      this.getGroup(id),
      this.getCurrentPlayer(),
    ])
      .map(([group, currentPlayer]) => {
        // TODO relocate to service
        if (!group) {
          this.notificationService.error('Can\'t find that group');
          return false;
        }
        const adminGroups = currentPlayer.adminGroupIds;
        const canEdit = adminGroups.includes(group.id);
        if (!canEdit) {
          this.notificationService.error('Not allowed to edit this group');
        }
        return canEdit;
      });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.canEdit(+route.params['id']);
  }
}
