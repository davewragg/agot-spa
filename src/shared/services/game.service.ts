import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {GameIndex} from '../models/game-index.model';

@Injectable()
export class GameService {
  static createNewGame():Game {
    return <Game>{
      date: new Date().toISOString(),
      gamePlayers: [],
      deckTypeId: 3, // tournament
      coreSetCount: 3
    };
  }

  constructor(private _DataService:DataService) {
  }

  getAllGames():Observable<Game[]> {
    return this._DataService.getGameIndex()
      .map((gameIndex:GameIndex) => gameIndex.allResults.games);
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
      return this._DataService.updateGame(game);
    } else {
      return this._DataService.createGame(game);
    }
  }
}
