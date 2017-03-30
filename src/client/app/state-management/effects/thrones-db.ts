import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as thronesDbActions from '../actions/thrones-db';
import { NotificationService } from '../../shared/services/notification.service';
import { ThronesDbService } from '../../shared/services/thrones-db.service';

@Injectable()
export class ThronesDbEffects {
  @Effect()
  importDeck$: Observable<Action> = this.actions$
    .ofType(thronesDbActions.ActionTypes.IMPORT_DECK)
    .map((action: thronesDbActions.ImportDeckAction) => action.payload)
    .mergeMap(thronesDbId =>
      this.thronesDbService.importAndConvertThronesDbDeck(thronesDbId)
        .map((deck) => new thronesDbActions.ImportDeckSuccessAction(deck))
        .catch((error) => of(new thronesDbActions.ImportDeckFailureAction(error.toString())))
    );

  @Effect({ dispatch: false })
  importDeckError$ = this.actions$
    .ofType(thronesDbActions.ActionTypes.IMPORT_DECK_FAILURE)
    .map((action: thronesDbActions.ImportDeckFailureAction) => action.payload)
    .do(error =>
      // TODO check error code for 403 here and admonish
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

  constructor(private actions$: Actions,
              private thronesDbService: ThronesDbService,
              private notificationService: NotificationService) {
  }
}
