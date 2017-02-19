import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import * as deckActions from '../actions/deck';
import { DeckService } from '../../shared/services/deck.service';
import { StatsService } from '../../shared/services/stats.service';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application. StateUpdates is an observable of the latest state and
 * dispatched action. The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class DeckEffects {
  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.FILTER)
    .debounceTime(300)
    .map((action: deckActions.FilterAction) => action.payload)
    .switchMap(criteria => {
      if (!criteria) {
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(deckActions.ActionTypes.FILTER).skip(1);

      return this.deckService.getDecks(criteria)
        .takeUntil(nextSearch$)
        .map(decks => new deckActions.FilterCompleteAction(decks))
        .catch(() => of(new deckActions.FilterCompleteAction([])));
    });

  @Effect()
  saveUpdatedDeck$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.SAVE_UPDATED)
    .map((action: deckActions.SaveUpdateAction) => action.payload)
    .mergeMap(deck =>
      this.deckService.updateDeck(deck)
        .map(() => new deckActions.SaveUpdateCompleteAction(deck))
        .catch((error) => of(new deckActions.SaveUpdateFailureAction(error)))
    );

  @Effect()
  saveUpdatedDeckSuccess$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.SAVE_UPDATED_COMPLETE)
    .map((action: deckActions.SaveUpdateCompleteAction) => action.payload)
    .map(deck => go(['decks', deck.deckId]));

  @Effect({ dispatch: false })
  saveUpdatedDeckError$ = this.actions$
    .ofType(deckActions.ActionTypes.SAVE_UPDATED_FAILURE)
    .map((action: deckActions.SaveUpdateFailureAction) => action.payload)
    .do(error =>
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

  @Effect()
  getStats$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.SELECT)
    // .debounceTime(300)
    .map((action: deckActions.SelectAction) => action.payload)
    .switchMap(deckId => {
      if (!deckId) {
        return empty();
      }

      const nextStats$ = this.actions$.ofType(deckActions.ActionTypes.SELECT).skip(1);

      return this.statsService.getDeckStats(deckId)
        .takeUntil(nextStats$)
        .map(stats => new deckActions.SelectCompleteAction(stats))
        .catch(() => of(new deckActions.SelectCompleteAction(undefined)));
    });

  constructor(private actions$: Actions,
              private deckService: DeckService,
              private notificationService: NotificationService,
              private statsService: StatsService) {
  }
}
