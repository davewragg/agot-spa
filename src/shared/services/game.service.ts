import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {FilterCriteria} from '../models/filter-criteria.model';

@Injectable()
export class GameService {

  constructor(private dataService:DataService) {
  }

  getGames(filterCriteria?:FilterCriteria):Observable<Game[]> {
    if (filterCriteria) {
      return this.dataService.getGames(filterCriteria);
    } else {
      return this.dataService.getAllGames();
    }
  }

  getGame(gameId:number):Observable<Game> {
    return this.dataService.getGame(gameId);
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
