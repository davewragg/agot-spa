import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import * as refData from '../actions/ref-data.actions';
import { ReferenceDataService } from '../../shared/services/reference-data.service';
import { SeasonService } from '../../shared/services/season.service';

@Injectable()
export class RefDataEffects {
  /**
   * This effect makes use of the `startWith` operator to trigger
   * the effect immediately on startup.
   */
  @Effect()
  loadRefData$: Observable<Action> = this.actions$
    .ofType(refData.LOAD)
    .startWith(new refData.LoadAction())
    .switchMap(() => {
      return combineLatest(
        this.refDataService.factions,
        this.refDataService.agendas,
        this.refDataService.venues,
        this.seasonService.seasons,
      )
        .map((response) => new refData.LoadSuccessAction(response))
        .catch((error: Error) => of(new refData.LoadFailAction(error)));
    });

  constructor(private actions$: Actions,
              private refDataService: ReferenceDataService,
              private seasonService: SeasonService) {
  }
}
