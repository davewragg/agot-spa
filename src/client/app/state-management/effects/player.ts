import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { PlayerService } from '../../shared/services/player.service';
import { StatsService } from '../../shared/services/stats.service';
import * as playerActions from '../actions/player';

@Injectable()
export class PlayerEffects {
  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(playerActions.ActionTypes.GET_FOR_GROUP)
    .map((action: playerActions.GetForGroupAction) => action.payload)
    .switchMap(playerGroupId => {
      if (!playerGroupId || isNaN(playerGroupId)) {
        return of(new playerActions.GetForGroupCompleteAction([]));
      }

      const nextSearch$ = this.actions$.ofType(playerActions.ActionTypes.GET_FOR_GROUP).skip(1);

      return this.playerService.getPlayers(playerGroupId)
        .takeUntil(nextSearch$)
        .map(players => new playerActions.GetForGroupCompleteAction(players))
        .catch(() => of(new playerActions.GetForGroupCompleteAction([])));
    });

  @Effect()
  getStats$: Observable<Action> = this.actions$
    .ofType(playerActions.ActionTypes.SELECT)
    .map((action: playerActions.SelectAction) => action.payload)
    .switchMap(({ playerId, criteria }) => {
      const nextStats$ = this.actions$.ofType(playerActions.ActionTypes.SELECT).skip(1);

      return this.statsService.getPlayerStats(playerId, criteria)
        .takeUntil(nextStats$)
        .map(stats => new playerActions.SelectCompleteAction(stats))
        .catch(() => of(new playerActions.SelectCompleteAction(undefined)));
    });

  constructor(private actions$: Actions,
              private playerService: PlayerService,
              private statsService: StatsService) {
  }
}
