import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {GameIndex} from '../models/game-index.model';
import {FilterCriteria} from '../models/filter-criteria.model';

@Injectable()
export class GameService {
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
  }

  getAllGames():Observable<Game[]> {
    return this.dataService.getGameIndex()
      .map((gameIndex:GameIndex) => gameIndex.allResults.games);
  }

  getGames(filterCriteria:FilterCriteria):Observable<Game[]> {
    return this.getAllGames().map(filterGames);

    function filterGames(games:Game[]) {
      return games.filter((game:Game) => {
        return (!filterCriteria.fromDate || game.date >= filterCriteria.fromDate) &&
          (!filterCriteria.toDate || game.date <= filterCriteria.toDate);
      }).sort(sortGames);

      function sortGames(game1:Game, game2:Game) {
        if (game1.date > game2.date) {
          return filterCriteria.ascending ? -1 : 1;
        }
        if (game1.date < game2.date) {
          return filterCriteria.ascending ? 1 : -1;
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
}
