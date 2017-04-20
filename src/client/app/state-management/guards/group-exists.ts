import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as fromRoot from '../reducers/root';
import * as playerGroupActions from '../actions/player-group.actions';
import { PlayerGroupService } from '../../shared/services/player-group.service';

@Injectable()
export class PlayerGroupExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromRoot.State>,
    private playerGroupService: PlayerGroupService,
    private router: Router
  ) { }

  hasPlayerGroupInStore(id: number): Observable<boolean> {
    return this.store.select(fromRoot.getPlayerGroupEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  hasPlayerGroupInApi(id: number): Observable<boolean> {
    return this.playerGroupService.getPlayerGroup(id)
      .map(playerGroupEntity => new playerGroupActions.LoadAction(playerGroupEntity))
      .do((action: playerGroupActions.LoadAction) => this.store.dispatch(action))
      .map(playerGroup => !!playerGroup)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  hasPlayerGroup(id: number): Observable<boolean> {
    return this.hasPlayerGroupInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasPlayerGroupInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasPlayerGroup(+route.params['id']);
  }
}
