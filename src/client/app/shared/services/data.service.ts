import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment/moment';
import { cloneDeep, pick, omit } from 'lodash';
import { Config } from '../config/env.config';
import { Game } from '../models/game.model';
import { FilterCriteria } from '../models/filter-criteria.model';
import { DateRangeType } from '../models/date-range-type.model';
import { SetOfResults } from '../models/set-of-results.model';
import { Deck } from '../models/deck.model';

declare let Rollbar: any;

@Injectable()
export class DataService {
  private today: string;
  private aWeekAgo: string;

  private baseUrl = Config.API;

  private static setAllTime(criteria: FilterCriteria) {
    return DataService.setDates(criteria, null, null);
  }

  private static setDates(criteria: FilterCriteria, fromDate?: string, toDate?: string) {
    return Object.assign(criteria, {
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  private static convertFilterCriteriaToSearchParams(filterCriteria: FilterCriteria) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('startDate', !filterCriteria.fromDate ? 'null' : filterCriteria.fromDate);
    params.set('endDate', !filterCriteria.toDate ? 'null' : filterCriteria.toDate);
    // yes I know this is backwards but it's a quick fix here
    params.set('sortBy', filterCriteria.ascending ? 'desc' : 'asc');
    if (filterCriteria.playerIds) {
      filterCriteria.playerIds.forEach((playerId) => params.append('playerIds', playerId + ''));
    }
    if (filterCriteria.factionIds) {
      filterCriteria.factionIds.forEach((factionId) => params.append('factionIds', factionId + ''));
    }
    if (filterCriteria.agendaIds) {
      filterCriteria.agendaIds.forEach((agendaId) => params.append('agendaIds', agendaId + ''));
    }
    if (filterCriteria.deckIds) {
      filterCriteria.deckIds.forEach((deckId) => params.append('deckIds', deckId + ''));
    }
    return params;
  }

  private static _serialiseGame(game: Game): string {
    const gameCopy = this._prepareGameData(game);
    return JSON.stringify(gameCopy);
  }

  private static _prepareGameData(game: Game) {
    //noinspection TypeScriptUnresolvedFunction
    const gameCopy: any = cloneDeep(game);
    // if deck has id, strip everything else
    gameCopy.gamePlayers.forEach((player: any) => {
      delete player.player;
      if (player.deck.deckId) {
        player.deck = pick(player.deck, ['deckId']);
      } else {
        player.deck = DataService._prepareDeckData(player.deck);
      }
    });
    return gameCopy;
  }

  private static _serialiseDeck(deck: Deck): string {
    const deckCopy = this._prepareDeckData(deck);
    return JSON.stringify(deckCopy);
  }

  private static _prepareDeckData(deck: Deck) {
    //noinspection TypeScriptUnresolvedFunction
    return omit(cloneDeep(deck), [
      'faction', 'agenda', 'fallbackTitle', 'dateCreated', 'dateModified'
    ]);
  }

  private static _getContentHeaders() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return { headers: headers };
  }

  private static handleResponse(response: Response): any {
    const json = response.json();
    if (json.error) {
      Rollbar.error(json.error.Message, json.error);
      throw new Error(<string>json.error.Message);
    }
    return json.payload;
  }

  constructor(private http: Http) {
    // TODO strip time from these
    this.today = moment().add(1, 'days').toISOString();
    this.aWeekAgo = moment().subtract(7, 'days').toISOString();
  }

  getRankings(filterCriteria: FilterCriteria): Observable<SetOfResults> {
    console.log('getRankings called');
    const criteria: FilterCriteria = this.setDatesFromRangeType(filterCriteria);
    const params = DataService.convertFilterCriteriaToSearchParams(criteria);
    return this.http.get(this.baseUrl + 'api/rankings/get', {
      search: params
    })
      .map(DataService.handleResponse);
  }

  getFilteredGames(filterCriteria: FilterCriteria) {
    console.log('getfilteredgames called');
    const params = DataService.convertFilterCriteriaToSearchParams(filterCriteria);
    return this.http.get(this.baseUrl + 'api/games/searchgames', {
      search: params
    })
      .map(DataService.handleResponse);
  }

  getGames(filterCriteria: FilterCriteria) {
    const criteria: FilterCriteria = this.setDatesFromRangeType(filterCriteria);
    return this.getFilteredGames(criteria);
  }

  getGame(gameId: number): Observable<Game> {
    console.log('getgame called', gameId);
    return this.http.get(this.baseUrl + 'api/games/get/' + gameId)
      .map(DataService.handleResponse);
  }

  updateGame(game: Game): Observable<Game> {
    console.log('updategame called', game);
    return this.http.put(this.baseUrl + 'api/games/edit',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
  }

  createGame(game: Game): Observable<Game> {
    console.log('creategame called', game);
    return this.http.post(this.baseUrl + 'api/games/create',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
  }

  deleteGame(gameId: number): Observable<any> {
    console.log('deletegame called', gameId);
    return this.http.delete(this.baseUrl + 'api/games/delete/' + gameId)
      .map(DataService.handleResponse);
  }

  /*
   @param refDataType: factions / agendas / players / decks
   */
  getReferenceData(refDataType: string, additionalParams?: string): Observable<any> {
    console.log('getReferenceData called', refDataType);
    return this.http.get(this.baseUrl + `api/${refDataType}/getall`, {
      search: additionalParams
    })
    // TODO .share()?
    // .cache()
      .map(DataService.handleResponse);
  }

  updateDeck(deck: Deck): Observable<Deck> {
    console.log('updatedeck called', deck);
    return this.http.put(this.baseUrl + 'api/decks/edit',
      DataService._serialiseDeck(deck),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
  }

  private setDatesFromRangeType(criteria: FilterCriteria) {
    const updatedCriteria = Object.assign({}, criteria);
    const range = updatedCriteria.rangeSelection;
    if (range === DateRangeType.THIS_WEEK) {
      this.setAWeekAgo(updatedCriteria);
    } else if (range === DateRangeType.ALL_TIME) {
      DataService.setAllTime(updatedCriteria);
    }
    return updatedCriteria;
  }

  private setAWeekAgo(criteria: FilterCriteria) {
    return DataService.setDates(criteria, this.aWeekAgo, this.today);
  }
}
