import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {GameIndex} from '../models/game-index.model';
import {Game} from '../models/game.model';
import {FilterCriteria} from '../models/filter-criteria.model';
import {DateRangeType} from '../models/date-range-type.model';
import * as moment from 'moment/moment';
import {Headers} from 'angular2/http';
import {URLSearchParams} from 'angular2/http';
import * as _ from 'lodash';

@Injectable()
export class DataService {
  private data:Observable<GameIndex>;

  private today:string;
  private aWeekAgo:string;

  //private baseUrl = '<%= ENV %>' === 'prod' ? '' : '//paulhoughton.org/agot';
  private baseUrl = '//paulhoughton.org/agot';

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
    // TODO if deck has id, strip everything else
    const gameCopy:any = _.cloneDeep(game);
    gameCopy.gamePlayers.forEach((player:any) => {
      if (player.deck.deckId) {
        player.deck = {deckId: player.deck.deckId};
      }
    });
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

  getGameIndex():Observable<GameIndex> {
    console.log('getgameindex called');
    if (!this.data) {
      this.data = this._getGameIndex();
    }
    return this.data;
  }

  getAllGames() {
    console.log('getallgames called');
    return this.getGameIndex()
      .map((gameIndex:GameIndex) => gameIndex.allResults.games);
  }

  getFilteredGames(filterCriteria:FilterCriteria) {
    console.log('getfilteredgames called');
    const params = DataService.convertFilterCriteriaToSearchParams(filterCriteria);
    return this.http.get(this.baseUrl + '/api/games/searchgames', {
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
    return this.http.get(this.baseUrl + '/api/games/get/' + gameId)
      .map(DataService.handleResponse);
  }

  updateGame(game:Game):Observable<Game> {
    console.log('updategame called', game);
    return this.http.put(this.baseUrl + '/api/games/update',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
    // TODO update cache? PBR covered?
  }

  createGame(game:Game):Observable<Game> {
    console.log('creategame called', game);
    return this.http.post(this.baseUrl + '/api/games/create',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
    // TODO check for response id
    // TODO insert into cache
  }

  deleteGame(gameId:number):Observable<any> {
    console.log('deletegame called', gameId);
    return this.http.delete(this.baseUrl + '/api/games/delete/' + gameId)
      .map(DataService.handleResponse);
  }

  private _getGameIndex():Observable<GameIndex> {
    console.log('_getgameindex called');
    return this.http.get(this.baseUrl + '/api/games/getall')
      .map(DataService.handleResponse).share();
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
