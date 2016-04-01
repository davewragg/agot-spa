import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {DeckService} from './deck.service';
import {FilterCriteria} from '../models/filter-criteria.model';
import {CacheService} from './cache.service';

@Injectable()
export class GameService {

  private _cache:Map<string, Observable<Game[]>> = new Map<string, Observable<Game[]>>();

  constructor(private dataService:DataService,
              private cacheService:CacheService,
              private deckService:DeckService) {
  }

  invalidate() {
    console.log('!::invalidate game cache');
    this._cache.clear();
  }

  getGames(filterCriteria?:FilterCriteria):Observable<Game[]> {
    const key:string = filterCriteria ? JSON.stringify(filterCriteria) : 'ALL';
    console.log('get games', key);
    if (this._cache.has(key)) {
      console.log('::cached');
      return this._cache.get(key);
    }
    console.log('::not cached');
    const games = this.dataService.getGames(filterCriteria).cache();
    this._cache.set(key, games);
    console.log('::games cache size', this._cache.size);
    return games;
  }

  getGame(gameId:number):Observable<Game> {
    return this.dataService.getGame(gameId);
  }

  updateGame(game:Game):Observable<Game> {
    this.cacheService.invalidate();
    this.deckService.invalidate();
    this.invalidate();
    if (game.gameId) {
      return this.dataService.updateGame(game);
    } else {
      return this.dataService.createGame(game);
    }
  }

  deleteGame(gameId:number):Observable<any> {
    this.cacheService.invalidate();
    this.deckService.invalidate();
    this.invalidate();
    return this.dataService.deleteGame(gameId);
  }
}
