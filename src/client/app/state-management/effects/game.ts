import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import * as gameActions from '../actions/game';
import { GameService } from '../../shared/services/game.service';
import { go } from '@ngrx/router-store';
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
export class GameEffects {
  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(gameActions.ActionTypes.FILTER)
    .debounceTime(300)
    .map((action: gameActions.FilterAction) => action.payload)
    .switchMap(criteria => {
      if (!criteria) {
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(gameActions.ActionTypes.FILTER).skip(1);

      return this.gameService.getGames(criteria)
        .takeUntil(nextSearch$)
        .map(games => new gameActions.FilterCompleteAction(games))
        .catch(() => of(new gameActions.FilterCompleteAction([])));
    });

  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(gameActions.ActionTypes.DELETE)
    .map((action: gameActions.DeleteAction) => action.payload)
    .mergeMap(game =>
      this.gameService.deleteGame(game.gameId)
        .map(() => new gameActions.DeleteCompleteAction(game))
        .catch((error) => of(new gameActions.DeleteFailureAction(error)))
    );

  @Effect()
  deleteGameSuccess$: Observable<Action> = this.actions$
    .ofType(gameActions.ActionTypes.DELETE_COMPLETE)
    .map((action: gameActions.DeleteCompleteAction) => action.payload)
    .do(() =>
      this.notificationService.success('There', `I hope you're happy`)
    )
    .map(game => go(['/404']));

  @Effect({ dispatch: false })
  deleteGameError$ = this.actions$
    .ofType(gameActions.ActionTypes.DELETE_FAILURE)
    .map((action: gameActions.DeleteFailureAction) => action.payload)
    .do(error =>
      // TODO check error code for 403 here and admonish
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

  constructor(private actions$: Actions,
              private gameService: GameService,
              private notificationService: NotificationService) {
  }
}
