import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import * as game from '../actions/game';
import { GameService } from '../../shared/services/game.service';

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
    .ofType(game.ActionTypes.FILTER)
    .debounceTime(300)
    .map((action: game.FilterAction) => action.payload)
    .switchMap(criteria => {
      if (!criteria) {
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(game.ActionTypes.FILTER).skip(1);

      return this.gameService.getGames(criteria)
        .takeUntil(nextSearch$)
        .map(games => new game.FilterCompleteAction(games))
        .catch(() => of(new game.FilterCompleteAction([])));
    });

  constructor(private actions$: Actions, private gameService: GameService) {
  }
}