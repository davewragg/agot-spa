import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import { of } from 'rxjs/observable/of';
import * as currentPlayerActions from '../actions/current-player.actions';
import { PlayerService } from '../../shared/services/player.service';

@Injectable()
export class CurrentPlayerEffects {
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(currentPlayerActions.LOAD)
    .startWith(new currentPlayerActions.LoadAction())
    .switchMap(() => {
      const nextLoad$ = this.actions$.ofType(currentPlayerActions.LOAD).skip(1);

      return this.playerService.getCurrentPlayer()
        .takeUntil(nextLoad$)
        .map(player => player ?
          new currentPlayerActions.LoadCompleteAction(player) :
          go(['/401', { q: window.location.pathname }]))
        .catch(() => of(go(['/401', { q: window.location.pathname }])));
    });

  constructor(private actions$: Actions, private playerService: PlayerService) {
  }
}
