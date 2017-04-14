import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { RankingService } from '../../shared/services/ranking.service';
import { DateService } from '../../shared/services/date.service';
import * as rankingsActions from '../actions/rankings.actions';

@Injectable()
export class RankingsEffects {
  @Effect()
  setDates$: Observable<Action> = this.actions$
    .ofType(rankingsActions.ActionTypes.SET_FILTER)
    .debounceTime(300)
    .map((action: rankingsActions.SetFilterAction) => action.payload)
    .switchMap(criteria => {
      const nextSearch$ = this.actions$.ofType(rankingsActions.ActionTypes.SET_FILTER).skip(1);

      return of(this.dateService.setDatesFromRangeType(criteria))
        .takeUntil(nextSearch$)
        .map(populatedCriteria => new rankingsActions.FilterAction(populatedCriteria))
        .catch(() => empty());
    });

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(rankingsActions.ActionTypes.FILTER)
    // .debounceTime(300)
    .map((action: rankingsActions.FilterAction) => action.payload)
    .switchMap(criteria => {
      if (!criteria) {
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(rankingsActions.ActionTypes.FILTER).skip(1);

      return this.rankingService.getRankings(criteria)
        .takeUntil(nextSearch$)
        .map(rankings => new rankingsActions.FilterCompleteAction(rankings))
        .catch(() => of(new rankingsActions.FilterCompleteAction(undefined)));
    });

  constructor(private actions$: Actions,
              private rankingService: RankingService,
              private dateService: DateService) {
  }
}
