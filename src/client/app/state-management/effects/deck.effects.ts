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
import { DateService } from '../../shared/services/date.service';
import { Deck } from '../../shared/models/deck.model';
import { Agenda } from '../../shared/models/agenda.model';
import { Faction } from '../../shared/models/faction.model';
import * as deckActions from '../actions/deck.actions';
import * as gameActions from '../actions/game.actions';
import * as playerGroupActions from '../actions/player-group.actions';
import * as fromRoot from '../reducers/root';

@Injectable()
export class DeckEffects {
  @Effect()
  setDates$: Observable<Action> = this.actions$
    .ofType(deckActions.SET_FILTER)
    .debounceTime(300)
    .map((action: deckActions.SetFilterAction) => action.payload)
    .switchMap(criteria => {
      const nextSearch$ = this.actions$.ofType(deckActions.SET_FILTER).skip(1);

      return of(this.dateService.setDatesFromRangeType(criteria))
        .takeUntil(nextSearch$)
        .map(populatedCriteria => new deckActions.FilterAction(populatedCriteria))
        .catch(() => empty());
    });

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(deckActions.FILTER)
    .debounceTime(300)
    .map((action: deckActions.FilterAction) => action.payload)
    .switchMap(criteria => {
      const nextSearch$ = this.actions$.ofType(deckActions.FILTER).skip(1);

      return this.deckService.getDecks(criteria)
        .takeUntil(nextSearch$)
        .map(decks => new deckActions.FilterCompleteAction(decks))
        .catch(() => of(new deckActions.FilterCompleteAction([])));
    });

  @Effect()
  getForPlayer$: Observable<Action> = this.actions$
    .ofType(gameActions.ADD_PLAYER, gameActions.EDIT_PLAYER)
    .map((action: gameActions.EditPlayerAction) => action.payload)
    .switchMap(player => {
      const nextSearch$ = this.actions$.ofType(gameActions.EDIT_PLAYER).skip(1);

      return this.deckService.getDecksFor(player.playerId)
        .takeUntil(nextSearch$)
        .map(decks => new deckActions.FilterCompleteAction(decks))
        .catch(() => of(new deckActions.FilterCompleteAction([])));
    });

  @Effect()
  getForPlayerGroup$: Observable<Action> = this.actions$
    .ofType(playerGroupActions.SELECT)
    .map((action: playerGroupActions.SelectAction) => action.payload)
    .switchMap(playerGroupId => {
      if (!playerGroupId) {
        return empty();
      }
      const nextSearch$ = this.actions$.ofType(gameActions.SELECT).skip(1);

      return this.deckService.getDecksBy({
        playerGroupIds: [playerGroupId],
      })
        .takeUntil(nextSearch$)
        .map(decks => new deckActions.LoadForGroupAction(decks))
        .catch(() => of(new deckActions.LoadForGroupAction([])));
    });

  @Effect()
  updateDeck$: Observable<Action> = this.actions$
    .ofType(deckActions.UPDATE)
    .map((action: deckActions.UpdateAction) => action.payload)
    .map(deck => {
        const populatedDeck = this.populateDeck(deck);
        return new deckActions.UpdateCompleteAction(populatedDeck);
      }
    );

  @Effect()
  saveUpdatedDeck$: Observable<Action> = this.actions$
    .ofType(deckActions.SAVE_UPDATED)
    .map((action: deckActions.SaveUpdateAction) => action.payload)
    .mergeMap(deck =>
      this.deckService.updateDeck(deck)
        .map(() => new deckActions.SaveUpdateCompleteAction(deck))
        .catch((error) => of(new deckActions.SaveUpdateFailureAction(error)))
    );

  @Effect()
  saveUpdatedDeckSuccess$: Observable<Action> = this.actions$
    .ofType(deckActions.SAVE_UPDATED_COMPLETE)
    .map((action: deckActions.SaveUpdateCompleteAction) => action.payload)
    .map(deck => go(['decks', deck.deckId]));

  @Effect({ dispatch: false })
  saveUpdatedDeckError$ = this.actions$
    .ofType(deckActions.SAVE_UPDATED_FAILURE)
    .map((action: deckActions.SaveUpdateFailureAction) => action.payload)
    .do(error =>
      // TODO check error code for 403 here and admonish
      this.notificationService.error('Whoops', error.message || error._body || error)
    );

  @Effect()
  getStats$: Observable<Action> = this.actions$
    .ofType(deckActions.SELECT)
    // .debounceTime(300)
    .map((action: deckActions.SelectAction) => action.payload)
    .switchMap(deckId => {
      if (!deckId) {
        return empty();
      }

      const nextStats$ = this.actions$.ofType(deckActions.SELECT).skip(1);

      return this.statsService.getDeckStats(deckId)
        .takeUntil(nextStats$)
        .map(stats => new deckActions.SelectCompleteAction(stats))
        .catch(() => of(new deckActions.SelectCompleteAction(undefined)));
    });

  _factions: { [id: string]: Faction };
  _agendas: { [id: string]: Agenda };

  private static setDefaultTitle(deck: Deck) {
    const defaultTitle = DeckEffects.getDefaultTitle(deck);
    if (!deck.title) {
      deck.title = defaultTitle;
    }
    return deck;
  }

  private static getDefaultTitle(deck: Deck) {
    const { faction } = deck;
    return `New ${faction && faction.name} deck`;
  }

  constructor(private actions$: Actions,
              private deckService: DeckService,
              private notificationService: NotificationService,
              private statsService: StatsService,
              private dateService: DateService,
              private store: Store<fromRoot.State>) {
    store.select(fromRoot.getFactions).subscribe((factions) => this._factions = factions);
    store.select(fromRoot.getAgendas).subscribe((agendas) => this._agendas = agendas);
  }

  private populateDeck(deck: Deck) {
    const updatedDeck = Deck.patchValues(deck, {
      faction: this.getFaction(deck.factionId),
      agenda: deck.agendaId ? this.getAgenda(deck.agendaId) : null,
    });

    return DeckEffects.setDefaultTitle(updatedDeck);
  }

  private getFaction(factionId: number | string) {
    return this._factions[factionId];
  }

  private getAgenda(agendaId: number | string) {
    return this._agendas[agendaId];
  }
}
