import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as fromRoot from '../reducers/index';
import * as deck from '../actions/deck';
import { DeckService } from '../../shared/services/deck.service';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class DeckExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromRoot.State>,
    private deckService: DeckService,
    private router: Router
  ) { }

  /**
   * This method checks if a deck with the given ID is already registered
   * in the Store
   */
  hasDeckInStore(id: number): Observable<boolean> {
    return this.store.select(fromRoot.getDeckEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  /**
   * This method loads a deck with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasDeckInApi(id: number): Observable<boolean> {
    return this.deckService.getDeck(id)
      .map(deckEntity => new deck.LoadAction(deckEntity))
      .do((action: deck.LoadAction) => this.store.dispatch(action))
      .map(deck => !!deck)
      .catch(() => {
      // TODO have a 404
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  /**
   * `hasDeck` composes `hasDeckInStore` and `hasDeckInApi`. It first checks
   * if the deck is in store, and if not it then checks if it is in the
   * API.
   */
  hasDeck(id: number): Observable<boolean> {
    return this.hasDeckInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasDeckInApi(id);
      });
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a deck from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasDeck(+route.params['id']);
  }
}
