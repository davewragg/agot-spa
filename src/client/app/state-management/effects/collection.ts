import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import * as collection from '../actions/collection';
import { Game } from '../../shared/models/game.model';

@Injectable()
export class CollectionEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.db.open('games_app');
  });

  /**
   * This effect makes use of the `startWith` operator to trigger
   * the effect immediately on startup.
   */
  @Effect()
  loadCollection$: Observable<Action> = this.actions$
    .ofType(collection.ActionTypes.LOAD)
    .startWith(new collection.LoadAction())
    .switchMap(() =>
      this.db.query('games')
        .toArray()
        .map((games: Game[]) => new collection.LoadSuccessAction(games))
        .catch((error: Error) => of(new collection.LoadFailAction(error)))
    );

  @Effect()
  addGameToCollection$: Observable<Action> = this.actions$
    .ofType(collection.ActionTypes.ADD_GAME)
    .map((action: collection.AddGameAction) => action.payload)
    .mergeMap(game =>
      this.db.insert('games', [game])
        .map(() => new collection.AddGameSuccessAction(game))
        .catch(() => of(new collection.AddGameFailAction(game)))
    );

  @Effect()
  removeGameFromCollection$: Observable<Action> = this.actions$
    .ofType(collection.ActionTypes.REMOVE_GAME)
    .map((action: collection.RemoveGameAction) => action.payload)
    .mergeMap(game =>
      this.db.executeWrite('games', 'delete', [game.gameId])
        .map(() => new collection.RemoveGameSuccessAction(game))
        .catch(() => of(new collection.RemoveGameFailAction(game)))
    );

  constructor(private actions$: Actions, private db: Database) {
  }
}
