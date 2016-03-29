import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {DeckService} from './deck.service';
import {FilterCriteria} from '../models/filter-criteria.model';

@Injectable()
export class GameService {

  constructor(private dataService:DataService, private deckService:DeckService) {
  }

  getGames(filterCriteria?:FilterCriteria):Observable<Game[]> {
    return this.dataService.getGames(filterCriteria);
  }

  getGame(gameId:number):Observable<Game> {
    return this.dataService.getGame(gameId);
  }

  updateGame(game:Game):Observable<Game> {
    this.deckService.invalidate();
    if (game.gameId) {
      return this.dataService.updateGame(game);
    } else {
      return this.dataService.createGame(game);
    }
  }

  deleteGame(gameId:number):Observable<any> {
    this.deckService.invalidate();
    return this.dataService.deleteGame(gameId);
  }
}
