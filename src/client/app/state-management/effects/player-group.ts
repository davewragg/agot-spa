import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as playerGroup from '../actions/player-group';
import { PlayerGroupService } from '../../shared/services/player-group.service';

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
export class PlayerGroupEffects {
  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(playerGroup.ActionTypes.FILTER)
    .startWith(new playerGroup.FilterAction(null))
    .map((action: playerGroup.FilterAction) => action.payload)
    .switchMap(() => { // TODO filter some day?
      const nextSearch$ = this.actions$.ofType(playerGroup.ActionTypes.FILTER).skip(1);

      return this.playerGroupService.getPlayerGroups() // TODO filter
        .takeUntil(nextSearch$)
        .map(playerGroups => new playerGroup.FilterCompleteAction(playerGroups))
        .catch(() => of(new playerGroup.FilterCompleteAction([])));
    });

  constructor(private actions$: Actions, private playerGroupService: PlayerGroupService) {
  }
}
