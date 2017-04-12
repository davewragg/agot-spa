import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as fromRoot from '../reducers/root';
import * as game from '../actions/game.actions';
import { GameService } from '../../shared/services/game.service';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class GameExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromRoot.State>,
    private gameService: GameService,
    private router: Router
  ) { }

  /**
   * This method checks if a game with the given ID is already registered
   * in the Store
   */
  hasGameInStore(id: number): Observable<boolean> {
    return this.store.select(fromRoot.getGameEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  /**
   * This method loads a game with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasGameInApi(id: number): Observable<boolean> {
    return this.gameService.getGame(id)
      .map(gameEntity => new game.LoadAction(gameEntity))
      .do((action: game.LoadAction) => this.store.dispatch(action))
      .map(game => !!game)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  /**
   * `hasGame` composes `hasGameInStore` and `hasGameInApi`. It first checks
   * if the game is in store, and if not it then checks if it is in the
   * API.
   */
  hasGame(id: number): Observable<boolean> {
    return this.hasGameInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasGameInApi(id);
      });
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a game from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasGame(+route.params['id']);
  }
}
