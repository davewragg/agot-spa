import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {GameIndex} from '../models/game-index.model';
import {Game} from '../models/game.model';
import {FilterCriteria} from '../models/filter-criteria.model';
import {DateRangeType} from '../models/date-range-type.model';
import * as moment from 'moment/moment';


@Injectable()
export class DataService {
  private data:Observable<GameIndex>;

  private today:string;
  private aWeekAgo:string;


  private static _serialiseGame(game:Game):string {
    return JSON.stringify(game);
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
    const criteria = this.setDatesFromRangeType(filterCriteria);
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

  updateGame(game:Game):Observable<Game> {
    return this.http.put('/agot/Games/Update', DataService._serialiseGame(game))
      .map((response:Response) => response.json());
    // TODO update cache? PBR covered?
  }

  createGame(game:Game):Observable<Game> {
    return this.http.post('/agot/Games/Create', DataService._serialiseGame(game))
      .map((response:Response) => response.json());
    // TODO check for response id
    // TODO insert into cache
  }

  deleteGame(gameId:number):Observable<any> {
    return this.http.delete('/agot/Games/Delete/' + gameId)
      .map((response:Response) => response.json());
  }

  private _getGameIndex():Observable<GameIndex> {
    return this.getFromJson()
      .map((res:Response) => res.json());
  }

  private getFromJson():Observable<Response> {
    return this.http.get('/assets/data/GetAll.json');
  }

  //private getFromWeb():Observable<Response> {
  //  return this.http.get('/agot/Games/GetAll');
  //}

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

  private setDates(criteria, fromDate?:string, toDate?:string) {
    return Object.assign(criteria, {
      fromDate: fromDate,
      toDate: toDate,
    });
  };

}
