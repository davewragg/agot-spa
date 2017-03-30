import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import * as gameActions from '../actions/game';
import { GameService } from '../../shared/services/game.service';
import { go } from '@ngrx/router-store';
import { NotificationService } from '../../shared/services/notification.service';
import { Game } from '../../shared/models/game.model';
import * as fromRoot from '../reducers/root';

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

      return this.waitForRefDataToLoad().switchMap(() =>
        this.gameService.getGames(criteria)
          .takeUntil(nextSearch$)
          .map(games => new gameActions.FilterCompleteAction(games))
          .catch(() => of(new gameActions.FilterCompleteAction([])))
      );
    });

  @Effect()
  updateGame$: Observable<Action> = this.actions$
    .ofType(gameActions.ActionTypes.UPDATE)
    .map((action: gameActions.UpdateAction) => action.payload)
    .map(game => {
        const populatedGame = this.populateGame(game);
        return new gameActions.UpdateCompleteAction(populatedGame);
      }
    );

  @Effect()
  saveUpdatedGame$: Observable<Action> = this.actions$
    .ofType(gameActions.ActionTypes.SAVE_UPDATED)
    .map((action: gameActions.SaveUpdateAction) => action.payload)
    .mergeMap(game =>
      this.gameService.updateGame(game)
        .map((updatedGame) => new gameActions.SaveUpdateCompleteAction(updatedGame))
        .catch((error) => of(new gameActions.SaveUpdateFailureAction(error)))
    );

  @Effect()
  saveUpdatedGameSuccess$: Observable<Action> = this.actions$
    .ofType(gameActions.ActionTypes.SAVE_UPDATED_COMPLETE)
    .map((action: gameActions.SaveUpdateCompleteAction) => action.payload)
    .map(game => go(['games', game.gameId]));

  @Effect({ dispatch: false })
  saveUpdatedGameError$ = this.actions$
    .ofType(gameActions.ActionTypes.SAVE_UPDATED_FAILURE)
    .map((action: gameActions.SaveUpdateFailureAction) => action.payload)
    .do(error =>
      // TODO check error code for 403 here and admonish
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

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
              private notificationService: NotificationService,
              private store: Store<fromRoot.State>) {
  }

  waitForRefDataToLoad(): Observable<boolean> {
    return this.store.select(fromRoot.getRefDataLoaded)
      .filter(loaded => loaded)
      .take(1);
  }

  private populateGame(game: Game) {
    const updatedGame = Game.patchValues(game, {
      // faction: this.getFaction(game.factionId),
      // agenda: game.agendaId ? this.getAgenda(game.agendaId) : null,
    });

    return updatedGame;
  }
}
