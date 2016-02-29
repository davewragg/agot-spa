import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {GameIndex} from '../models/game-index.model';
import {FilterCriteria} from '../models/filter-criteria.model';
import {DateRangeType} from '../models/date-range-type.model';
import * as moment from 'moment/moment';

@Injectable()
export class GameService {
  private today:string;
  private aWeekAgo:string;

  static createNewGame():Game {
    return <Game>{
      date: new Date().toISOString(),
      gamePlayers: [],
      deckType: null,
      deckTypeId: 3, // tournament
      coreSetCount: 3
    };
  }


  constructor(private dataService:DataService) {
    this.today = moment().add(1, 'days').toISOString();
    this.aWeekAgo = moment().subtract(7, 'days').toISOString();
  }

  getAllGames():Observable<Game[]> {
    return this.dataService.getGameIndex()
      .map((gameIndex:GameIndex) => gameIndex.allResults.games);
  }

  getGames(filterCriteria:FilterCriteria):Observable<Game[]> {
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

  getGame(gameId:number):Observable<Game> {
    return this.getAllGames().map(
      (games:Game[]) => {
        return games.find((game:Game) => game.gameId === gameId);
      }
    );
  }

  updateGame(game:Game):Observable<Game> {
    if (game.gameId) {
      return this.dataService.updateGame(game);
    } else {
      return this.dataService.createGame(game);
    }
  }

  deleteGame(gameId:number):Observable<any> {
    return this.dataService.deleteGame(gameId);
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

  private setDates(criteria, fromDate?:string, toDate?:string) {
    return Object.assign(criteria, {
      fromDate: fromDate,
      toDate: toDate,
    });
  };

}
