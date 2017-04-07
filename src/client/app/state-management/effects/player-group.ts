import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PlayerGroupService } from '../../shared/services/player-group.service';
import { of } from 'rxjs/observable/of';
import * as playerGroup from '../actions/player-group';

@Injectable()
export class PlayerGroupEffects {
  @Effect()
  loadSelected$: Observable<Action> = this.actions$
    .ofType(playerGroup.ActionTypes.GET_SELECTED)
    .startWith(new playerGroup.GetSelectedAction())
    .switchMap(() => {

      return this.playerGroupService.getSelectedPlayerGroupId()
        .map(playerGroupId => new playerGroup.SelectAction(playerGroupId));
    });

  @Effect({ dispatch: false })
  setSelected$ = this.actions$
    .ofType(playerGroup.ActionTypes.SELECT)
    .map((action: playerGroup.SelectAction) => action.payload)
    .do((selectedPlayerGroupId) => {
      return this.playerGroupService.setSelectedPlayerGroupId(selectedPlayerGroupId);
    });

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
