import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { PlayerGroupService } from '../../shared/services/player-group.service';
import { NotificationService } from '../../shared/services/notification.service';
import * as playerGroupActions from '../actions/player-group.actions';

@Injectable()
export class PlayerGroupEffects {
  @Effect()
  loadSelected$: Observable<Action> = this.actions$
    .ofType(playerGroupActions.GET_SELECTED)
    .startWith(new playerGroupActions.GetSelectedAction())
    .switchMap(() => {

      return this.playerGroupService.getSelectedPlayerGroupId()
        .map(playerGroupId => new playerGroupActions.SelectAction(playerGroupId));
    });

  @Effect({ dispatch: false })
  setSelected$ = this.actions$
    .ofType(playerGroupActions.SELECT)
    .map((action: playerGroupActions.SelectAction) => action.payload)
    .do((selectedPlayerGroupId) => {
      return this.playerGroupService.setSelectedPlayerGroupId(selectedPlayerGroupId);
    });

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(playerGroupActions.FILTER)
    .startWith(new playerGroupActions.FilterAction(null))
    .map((action: playerGroupActions.FilterAction) => action.payload)
    .switchMap(() => { // TODO filter some day? currently just loads all
      const nextSearch$ = this.actions$.ofType(playerGroupActions.FILTER).skip(1);

      return this.playerGroupService.getPlayerGroups()
        .takeUntil(nextSearch$)
        .map(playerGroups => new playerGroupActions.FilterCompleteAction(playerGroups))
        .catch(() => of(new playerGroupActions.FilterCompleteAction([])));
    });

  @Effect()
  savePlayerGroup$: Observable<Action> = this.actions$
    .ofType(playerGroupActions.SAVE)
    .map((action: playerGroupActions.SaveAction) => action.payload)
    .mergeMap(playerGroup =>
      this.playerGroupService.updatePlayerGroup(playerGroup)
        .map((updatedPlayerGroup) => new playerGroupActions.SaveCompleteAction(updatedPlayerGroup))
        .catch((error) => of(new playerGroupActions.SaveFailureAction(error.toString())))
    );

  @Effect()
  savePlayerGroupSuccess$: Observable<Action> = this.actions$
    .ofType(playerGroupActions.SAVE_COMPLETE)
    .map((action: playerGroupActions.SaveCompleteAction) => action.payload)
    .map(playerGroup => go(['groups']));

  @Effect({ dispatch: false })
  savePlayerGroupError$ = this.actions$
    .ofType(playerGroupActions.SAVE_FAILURE)
    .map((action: playerGroupActions.SaveFailureAction) => action.payload)
    .do(error =>
      // TODO check error code for 403 here and admonish
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

  @Effect()
  joinPlayerGroup$: Observable<Action> = this.actions$
    .ofType(playerGroupActions.JOIN)
    .map((action: playerGroupActions.JoinAction) => action.payload)
    .mergeMap(playerGroup =>
      this.playerGroupService.joinPlayerGroup(playerGroup)
        .map((updatedPlayerGroup) => new playerGroupActions.JoinCompleteAction(updatedPlayerGroup))
        .catch((error) => of(new playerGroupActions.JoinFailureAction(error.toString())))
    );

  @Effect({ dispatch: false })
  joinPlayerGroupError$ = this.actions$
    .ofType(playerGroupActions.JOIN_FAILURE)
    .map((action: playerGroupActions.JoinFailureAction) => action.payload)
    .do(error =>
      // TODO check error code for 403 here and admonish
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

  constructor(private actions$: Actions,
              private notificationService: NotificationService,
              private playerGroupService: PlayerGroupService) {
  }
}
