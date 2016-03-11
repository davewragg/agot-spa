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

@Injectable()
export class DataService {
  private REMOTE_TIMEOUT = 30000;
  private data:Observable<GameIndex>;

  private today:string;
  private aWeekAgo:string;

  //private baseUrl = '<%= ENV %>' === 'prod' ? '' : '//paulhoughton.org/agot';
  private baseUrl = '//paulhoughton.org/agot';

  private static _serialiseGame(game:Game):string {
    // TODO if deck has id, strip everything else
    // TODO remove non-primitives
    return JSON.stringify(game);
  }

  private static _getContentHeaders() {
    const headers = new Headers({'Content-Type': 'application/json'});
    return {headers: headers};
  }

  private static handleResponse(response:Response):any {
    const json = response.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json.payload;
  }

  constructor(private http:Http) {
    this.today = moment().add(1, 'days').toISOString();
    this.aWeekAgo = moment().subtract(7, 'days').toISOString();
  }

  getGameIndex():Observable<GameIndex> {
    if (!this.data) {
      this.data = this._getGameIndex();
    }
    return this.data;
  }

  getAllGames() {
    return this.getGameIndex()
      .map((gameIndex:GameIndex) => gameIndex.allResults.games);
  }

  getGames(filterCriteria?:FilterCriteria) {
    const criteria:FilterCriteria = this.setDatesFromRangeType(filterCriteria);
    return this.getAllGames().map(filterGames);

    function filterGames(games:Game[]) {
      return games.filter((game:Game) => {
        return (!criteria.fromDate || game.date >= criteria.fromDate) &&
          (!criteria.toDate || game.date <= criteria.toDate);
      }).sort(sortGames);

      function sortGames(game1:Game, game2:Game) {
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
    return this.http.get(this.baseUrl + '/api/games/get/' + gameId)
      .map(DataService.handleResponse);
  }

  updateGame(game:Game):Observable<Game> {
    return this.http.put(this.baseUrl + '/api/games/update',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
    // TODO update cache? PBR covered?
  }

  createGame(game:Game):Observable<Game> {
    return this.http.post(this.baseUrl + '/api/games/create',
      DataService._serialiseGame(game),
      DataService._getContentHeaders())
      .map(DataService.handleResponse);
    // TODO check for response id
    // TODO insert into cache
  }

  deleteGame(gameId:number):Observable<any> {
    return this.http.delete(this.baseUrl + '/api/games/delete/' + gameId)
      .map(DataService.handleResponse);
  }

  private _getGameIndex():Observable<GameIndex> {
    return this.getFromWeb()
      .catch((error) => {
        console.warn(error);
        return this.getFromJson();
      });
  }

  private getFromWeb():Observable<GameIndex> {
    return this.http.get(this.baseUrl + '/api/games/getall')
      .timeout(this.REMOTE_TIMEOUT, new Error('timed out web'))
      .map(DataService.handleResponse);
  }

  private getFromJson():Observable<GameIndex> {
    return this.http.get('/assets/data/GetAll.json')
      .map((res:Response) => res.json());
  }

  private setDatesFromRangeType(criteria:FilterCriteria) {
    const updatedCriteria = Object.assign({}, criteria);
    const range = updatedCriteria.rangeSelection;
    if (range === DateRangeType.THIS_WEEK) {
      this.setAWeekAgo(updatedCriteria);
    } else if (range === DateRangeType.ALL_TIME) {
      this.setAllTime(updatedCriteria);
    }
    return updatedCriteria;
  }

  private setAWeekAgo(criteria:FilterCriteria) {
    return this.setDates(criteria, this.aWeekAgo, this.today);
  };

  private setAllTime(criteria:FilterCriteria) {
    return this.setDates(criteria, null, null);
  };

  private setDates(criteria:FilterCriteria, fromDate?:string, toDate?:string) {
    return Object.assign(criteria, {
      fromDate: fromDate,
      toDate: toDate,
    });
  };
}
