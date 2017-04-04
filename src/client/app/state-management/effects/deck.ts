import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { DeckService } from '../../shared/services/deck.service';
import { StatsService } from '../../shared/services/stats.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Deck } from '../../shared/models/deck.model';
import { Agenda } from '../../shared/models/agenda.model';
import { Faction } from '../../shared/models/faction.model';
import { DeckClass } from '../../shared/models/deck-class.model';
import * as deckActions from '../actions/deck';
import * as gameActions from '../actions/game';
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
export class DeckEffects {
  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.FILTER)
    .debounceTime(300)
    .startWith(new deckActions.FilterAction(null)) // load all decks from the off (!?)
    .map((action: deckActions.FilterAction) => action.payload)
    .switchMap(criteria => {
      const nextSearch$ = this.actions$.ofType(deckActions.ActionTypes.FILTER).skip(1);

      return this.deckService.getDecks(criteria)
        .takeUntil(nextSearch$)
        .map(decks => new deckActions.FilterCompleteAction(decks))
        .catch(() => of(new deckActions.FilterCompleteAction([])));
    });

  @Effect()
  getForPlayer$: Observable<Action> = this.actions$
    .ofType(gameActions.ActionTypes.ADD_PLAYER, gameActions.ActionTypes.EDIT_PLAYER)
    .map((action: gameActions.EditPlayerAction) => action.payload)
    .switchMap(player => {
      const nextSearch$ = this.actions$.ofType(gameActions.ActionTypes.EDIT_PLAYER).skip(1);

      return this.deckService.getDecksFor(player.playerId)
        .takeUntil(nextSearch$)
        .map(decks => new deckActions.FilterCompleteAction(decks))
        .catch(() => of(new deckActions.FilterCompleteAction([])));
    });

  @Effect()
  updateDeck$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.UPDATE)
    .map((action: deckActions.UpdateAction) => action.payload)
    .map(deck => {
        const populatedDeck = this.populateDeck(deck);
        return new deckActions.UpdateCompleteAction(populatedDeck);
      }
    );

  @Effect()
  saveUpdatedDeck$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.SAVE_UPDATED)
    .map((action: deckActions.SaveUpdateAction) => action.payload)
    .mergeMap(deck =>
      this.deckService.updateDeck(deck)
        .map(() => new deckActions.SaveUpdateCompleteAction(deck))
        .catch((error) => of(new deckActions.SaveUpdateFailureAction(error)))
    );

  @Effect()
  saveUpdatedDeckSuccess$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.SAVE_UPDATED_COMPLETE)
    .map((action: deckActions.SaveUpdateCompleteAction) => action.payload)
    .map(deck => go(['decks', deck.deckId]));

  @Effect({ dispatch: false })
  saveUpdatedDeckError$ = this.actions$
    .ofType(deckActions.ActionTypes.SAVE_UPDATED_FAILURE)
    .map((action: deckActions.SaveUpdateFailureAction) => action.payload)
    .do(error =>
      // TODO check error code for 403 here and admonish
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

  @Effect()
  getStats$: Observable<Action> = this.actions$
    .ofType(deckActions.ActionTypes.SELECT)
    // .debounceTime(300)
    .map((action: deckActions.SelectAction) => action.payload)
    .switchMap(deckId => {
      if (!deckId) {
        return empty();
      }

      const nextStats$ = this.actions$.ofType(deckActions.ActionTypes.SELECT).skip(1);

      return this.statsService.getDeckStats(deckId)
        .takeUntil(nextStats$)
        .map(stats => new deckActions.SelectCompleteAction(stats))
        .catch(() => of(new deckActions.SelectCompleteAction(undefined)));
    });

  _factions: { [id: string]: Faction };
  _agendas: { [id: string]: Agenda };

  constructor(private actions$: Actions,
              private deckService: DeckService,
              private notificationService: NotificationService,
              private statsService: StatsService,
              private store: Store<fromRoot.State>) {
    store.select(fromRoot.getFactions).subscribe((factions) => this._factions = factions);
    store.select(fromRoot.getAgendas).subscribe((agendas) => this._agendas = agendas);
  }

  private populateDeck(deck: Deck) {
    const updatedDeck = Deck.patchValues(deck, {
      faction: this.getFaction(deck.factionId),
      agenda: deck.agendaId ? this.getAgenda(deck.agendaId) : null,
    });

    return this.setDefaultTitle(updatedDeck);
  }

  private setDefaultTitle(deck: Deck) {
    const defaultTitle = this.getDefaultTitle(deck);
    if (!deck.title) { // TODO need a touched check here or something
      deck.title = defaultTitle;
    }
    return deck;
  }

  private getFaction(factionId: number | string) {
    return this._factions[factionId];
  }

  private getAgenda(agendaId: number | string) {
    return this._agendas[agendaId];
  }

  private getDefaultTitle(deck: Deck) {
    const { faction, agenda } = deck;
    const deckClassTitle = DeckClass.getDeckClassTitle(faction, agenda);
    return `New ${deckClassTitle} deck`;
  }
}
