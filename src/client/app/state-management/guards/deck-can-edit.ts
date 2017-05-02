import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as fromRoot from '../reducers/root';
import { Deck } from '../../shared/models/deck.model';
import { Player } from '../../shared/models/player.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class CanEditDeckGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
  }

  getDeck(id: number): Observable<Deck> {
    return this.store.select(fromRoot.getDeckEntities)
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
      this.getDeck(id),
      this.getCurrentPlayer(),
    ])
      .map(([deck, currentPlayer]) => {
        // TODO extract to service
        const isOwner = deck.creatorId === currentPlayer.playerId;
        const isImported = !!deck.thronesDbCode;
        const canEdit = !isImported && isOwner;
        if (!canEdit) {
          this.notificationService.error('Not allowed to edit this deck');
        }
        return canEdit;
      });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.canEdit(+route.params['id']);
  }
}
