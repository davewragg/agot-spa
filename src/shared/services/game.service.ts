import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {GameIndex} from '../models/game-index.model';

@Injectable()
export class GameService {
  constructor(private dataService:DataService) {
  }

  getGames():Observable<Game[]> {
    return this.dataService.getGameIndex()
      .map((gameIndex:GameIndex) => gameIndex.allResults.games);
  }
}
