import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as fromRoot from '../reducers/root';
import { Game } from '../../shared/models/game.model';
import { Player } from '../../shared/models/player.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class CanEditGameGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
  }

  getGame(id: number): Observable<Game> {
    return this.store.select(fromRoot.getGameEntities)
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
      this.getGame(id),
      this.getCurrentPlayer(),
    ])
      .map(([game, currentPlayer]) => {
        // TODO check whether there are any other permissions
        const canEdit = game.creatorId === currentPlayer.playerId;
        if (!canEdit) {
          this.notificationService.error('Not allowed to edit this game');
        }
        return canEdit;
      });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.canEdit(+route.params['id']);
  }
}
