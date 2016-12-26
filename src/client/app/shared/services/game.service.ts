import {Injectable} from '@angular/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {FilterCriteria} from '../models/filter-criteria.model';
import {CacheService} from './cache.service';

@Injectable()
export class GameService {

  constructor(private dataService:DataService,
              private cacheService:CacheService) {
  }

  getGames(filterCriteria?:FilterCriteria):Observable<Game[]> {
    return this.cacheService.getFilteredData('games', this.dataService.getGames, filterCriteria, this.dataService);
  }

  getGame(gameId:number):Observable<Game> {
    return this.dataService.getGame(gameId);
  }

  updateGame(game:Game):Observable<Game> {
    this.cacheService.invalidate();
    if (game.gameId) {
      return this.dataService.updateGame(game);
    } else {
      return this.dataService.createGame(game);
    }
  }

  deleteGame(gameId:number):Observable<any> {
    this.cacheService.invalidate();
    return this.dataService.deleteGame(gameId);
  }
}
