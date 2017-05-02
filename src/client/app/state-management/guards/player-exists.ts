import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as fromRoot from '../reducers/root';
import * as player from '../actions/player.actions';
import { PlayerService } from '../../shared/services/player.service';

@Injectable()
export class PlayerExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromRoot.State>,
    private playerService: PlayerService,
    private router: Router
  ) { }

  hasPlayerInStore(id: string): Observable<boolean> {
    return this.store.select(fromRoot.getPlayerEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  hasPlayerInApi(id: string): Observable<boolean> {
    return this.playerService.getPlayer(id)
      .map(playerEntity => new player.LoadAction(playerEntity))
      .do((action: player.LoadAction) => this.store.dispatch(action))
      .map(player => !!player)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  hasPlayer(id: string): Observable<boolean> {
    return this.hasPlayerInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasPlayerInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasPlayer(route.params['id']);
  }
}
