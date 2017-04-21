import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { startOfQuarter, endOfQuarter, subDays, startOfDay, endOfDay } from 'date-fns';
import { cloneDeep, pick, omit } from 'lodash';
import { Config } from '../config/env.config';
import { Game } from '../models/game.model';
import { FilterCriteria } from '../models/filter-criteria.model';
import { SetOfResults } from '../models/set-of-results.model';
import { Deck } from '../models/deck.model';
import { Player } from '../models/player.model';
import { RefDataType } from './ref-data.type';
import { PlayerGroup } from '../models/player-group.model';
import { Router } from '@angular/router';

declare let Rollbar: any;

@Injectable()
export class DataService {
  private baseUrl = Config.API;

  private static convertFilterCriteriaToSearchParams(filterCriteria: FilterCriteria) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('startDate', !filterCriteria.fromDate ? 'null' : filterCriteria.fromDate);
    params.set('endDate', !filterCriteria.toDate ? 'null' : filterCriteria.toDate);
    // yes I know this is backwards but it's a quick fix here
    params.set('sortBy', filterCriteria.ascending ? 'desc' : 'asc');
    if (filterCriteria.playerIds) {
      filterCriteria.playerIds.forEach((playerId) => params.append('playerIds', playerId));
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

  private static _serialisePlayerGroup(playerGroup: PlayerGroup): string {
    const playerGroupCopy = cloneDeep(playerGroup);
    delete playerGroupCopy.players;
    return JSON.stringify(playerGroupCopy);
  }

  private static _serialiseDeck(deck: Deck): string {
    const deckCopy = this._prepareDeckData(deck);
    return JSON.stringify(deckCopy);
  }

  private static _prepareDeckData(deck: Deck) {
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

  constructor(private http: Http, private router: Router) {
  }

  getRankings(criteria: FilterCriteria): Observable<SetOfResults> {
    console.log('getRankings called');
    const params = DataService.convertFilterCriteriaToSearchParams(criteria);
    const playerGroup = (criteria && criteria.playerGroupIds[0]) || 1; // TODO cough

    return this.http.get(`${this.baseUrl}api/rankings/get/${playerGroup}`, {
      search: params
    })
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getPlayerGroup(id: number): Observable<PlayerGroup> {
    console.log('getPlayerGroup called', id);
    return this.http.get(`${this.baseUrl}api/playergroups/get/${id}`)
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getPlayerGroups() {
    console.log('getPlayerGroups called');
    return this.http.get(`${this.baseUrl}api/playergroups/getall`)
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  updatePlayerGroup(playerGroup: PlayerGroup): Observable<PlayerGroup> {
    console.log('updatePlayerGroup called', playerGroup);
    return this.http.put(`${this.baseUrl}api/playergroups/edit`,
      DataService._serialisePlayerGroup(playerGroup),
      DataService._getContentHeaders())
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  createPlayerGroup(playerGroup: PlayerGroup): Observable<PlayerGroup> {
    console.log('createPlayerGroup called', playerGroup);
    return this.http.post(`${this.baseUrl}api/playergroups/create`,
      DataService._serialisePlayerGroup(playerGroup),
      DataService._getContentHeaders())
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getFilteredGames(filterCriteria: FilterCriteria) {
    console.log('getfilteredgames called');
    const params = DataService.convertFilterCriteriaToSearchParams(filterCriteria);
    return this.http.get(`${this.baseUrl}api/games/searchgames`, {
      search: params
    })
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getGames(criteria: FilterCriteria) {
    return this.getFilteredGames(criteria);
  }

  getGame(gameId: number): Observable<Game> {
    console.log('getgame called', gameId);
    return this.http.get(`${this.baseUrl}api/games/get/${gameId}`)
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  updateGame(game: Game): Observable<Game> {
    console.log('updategame called', game);
    return this.http.put(`${this.baseUrl}api/games/edit`,
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  createGame(game: Game): Observable<Game> {
    console.log('creategame called', game);
    return this.http.post(`${this.baseUrl}api/games/create`,
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  deleteGame(gameId: number): Observable<any> {
    console.log('deletegame called', gameId);
    return this.http.delete(`${this.baseUrl}api/games/delete/${gameId}`)
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  /*
   @param refDataType: factions / agendas / players / decks
   */
  getReferenceData(refDataType: RefDataType, additionalParams?: string): Observable<any> {
    console.log('getReferenceData called', refDataType);
    return this.http.get(this.baseUrl + `api/${refDataType}/getall`, {
      search: additionalParams
    })
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getPlayer(playerId: string): Observable<Player> {
    console.log('getPlayer called');
    return this.http.get(this.baseUrl + `api/players/get/${playerId}`)
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getPlayers(criteria: FilterCriteria): Observable<Player[]> {
    console.log('getPlayers called');
    const playerGroup = (criteria && criteria.playerGroupIds[0]) || 1; // TODO cough
    return this.http.get(this.baseUrl + `api/players/getall/${playerGroup}`, {
      search: 'includeMostPlayedFaction=true'
    })
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getCurrentPlayer(): Observable<Player> {
    console.log('getCurrentPlayer called');
    return this.http.get(`${this.baseUrl}api/players/currentplayer`)
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getDeck(deckId: number): Observable<Deck> {
    console.log('getdeck called', deckId);
    return this.http.get(`${this.baseUrl}api/decks/get/${deckId}`)
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  getDecks(criteria: FilterCriteria) {
    return this.getFilteredDecks(criteria);
  }

  getFilteredDecks(filterCriteria: FilterCriteria) {
    console.log('getfiltereddecks called');
    const params = DataService.convertFilterCriteriaToSearchParams(filterCriteria);
    return this.http.get(`${this.baseUrl}api/decks/searchdecks`, {
      search: params
    })
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  updateDeck(deck: Deck): Observable<Deck> {
    console.log('updatedeck called', deck);
    return this.http.put(`${this.baseUrl}api/decks/edit`,
      DataService._serialiseDeck(deck),
      DataService._getContentHeaders())
      .map(DataService.handleResponse)
      .catch(this.handleError.bind(this));
  }

  private handleError(error: Response): any {
    if (error.status === 401 && !this.router.url.startsWith('/401')) {
      const currentUrl = this.router.url;
      this.router.navigate(['/401', { q: currentUrl }]);
    }
    return Observable.throw(error);
  }

}
