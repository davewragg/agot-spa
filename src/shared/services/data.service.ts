import {Injectable} from 'angular2/core';
import {Http, Response, Headers, URLSearchParams} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Game} from '../models/game.model';
import {FilterCriteria} from '../models/filter-criteria.model';
import {DateRangeType} from '../models/date-range-type.model';
import {SetOfResults} from '../models/set-of-results.model';
import * as moment from 'moment/moment';
import * as _ from 'lodash';

@Injectable()
export class DataService {
  private today:string;
  private aWeekAgo:string;

  private baseUrl = '<%= ENV %>' === 'prod' ? '<%= APP_BASE %>' : '//paulhoughton.org<%= APP_BASE %>';
  //private baseUrl = '//paulhoughton.org/agot/';

  private static setAllTime(criteria:FilterCriteria) {
    return DataService.setDates(criteria, null, null);
  }

  private static setDates(criteria:FilterCriteria, fromDate?:string, toDate?:string) {
    return Object.assign(criteria, {
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  private static convertFilterCriteriaToSearchParams(filterCriteria:FilterCriteria) {
    const params:URLSearchParams = new URLSearchParams();
    params.set('startDate', filterCriteria.fromDate);
    params.set('endDate', filterCriteria.toDate);
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

  private static _serialiseGame(game:Game):string {
    //noinspection TypeScriptUnresolvedFunction
    const gameCopy:any = _.cloneDeep(game);
    // if deck has id, strip everything else
    // TODO re-enable once service fixed
    //gameCopy.gamePlayers.forEach((player:any) => {
    //  if (player.deck.deckId) {
    //    player.deck = {deckId: player.deck.deckId};
    //  }
    //});
    // TODO remove non-primitives
    return JSON.stringify(gameCopy);
  }

  private static _getContentHeaders() {
    const headers = new Headers({'Content-Type': 'application/json'});
    return {headers: headers};
  }

  private static handleResponse(response:Response):any {
    const json = response.json();
    if (json.error) {
      throw new Error(<string>json.error.Message);
    }
    return json.payload;
  }

  constructor(private http:Http) {
    // TODO strip time from these
    this.today = moment().add(1, 'days').toISOString();
    this.aWeekAgo = moment().subtract(7, 'days').toISOString();
  }

  getRankings(filterCriteria:FilterCriteria):Observable<SetOfResults> {
    console.log('getRankings called');
    const criteria:FilterCriteria = this.setDatesFromRangeType(filterCriteria);
    const params = DataService.convertFilterCriteriaToSearchParams(criteria);
    return this.http.get(this.baseUrl + 'api/rankings/get', {
        search: params
      })
      .map(DataService.handleResponse);
  }

  getFilteredGames(filterCriteria:FilterCriteria) {
    console.log('getfilteredgames called');
    const params = DataService.convertFilterCriteriaToSearchParams(filterCriteria);
    return this.http.get(this.baseUrl + 'api/games/searchgames', {
        search: params
      })
      .map(DataService.handleResponse);
  }

  getGames(filterCriteria:FilterCriteria) {
    const criteria:FilterCriteria = this.setDatesFromRangeType(filterCriteria);
    return this.getFilteredGames(criteria).map(sortGames);
    // TODO move to service when available
    function sortGames(games:Game[]) {
      return games.sort(gameSorter);

      function gameSorter(game1:Game, game2:Game) {
        if (game1.date > game2.date) {
          return criteria.ascending ? -1 : 1;
        }
        if (game1.date < game2.date) {
          return criteria.ascending ? 1 : -1;
        }
        return 0;
      }
    }
  }

  getGame(gameId:number):Observable<Game> {
    console.log('getgame called', gameId);
    return this.http.get(this.baseUrl + 'api/games/get/' + gameId)
      .map(DataService.handleResponse);
  }

  updateGame(game:Game):Observable<Game> {
    console.log('updategame called', game);
    return this.http.put(this.baseUrl + 'api/games/update',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
    // TODO update cache? PBR covered?
  }

  createGame(game:Game):Observable<Game> {
    console.log('creategame called', game);
    return this.http.post(this.baseUrl + 'api/games/create',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
    // TODO check for response id
    // TODO insert into cache
  }

  deleteGame(gameId:number):Observable<any> {
    console.log('deletegame called', gameId);
    return this.http.delete(this.baseUrl + 'api/games/delete/' + gameId)
      .map(DataService.handleResponse);
  }

  /*
   @param refDataType: factions / agendas / players / decks
   */
  getReferenceData(refDataType:string):Observable<any> {
    console.log('getReferenceData called', refDataType);
    return this.http.get(this.baseUrl + `api/${refDataType}/getall`)
      .map(DataService.handleResponse);
  }

  private setDatesFromRangeType(criteria:FilterCriteria) {
    const updatedCriteria = Object.assign({}, criteria);
    const range = updatedCriteria.rangeSelection;
    if (range === DateRangeType.THIS_WEEK) {
      this.setAWeekAgo(updatedCriteria);
    } else if (range === DateRangeType.ALL_TIME) {
      DataService.setAllTime(updatedCriteria);
    }
    return updatedCriteria;
  }

  private setAWeekAgo(criteria:FilterCriteria) {
    return DataService.setDates(criteria, this.aWeekAgo, this.today);
  }
}
