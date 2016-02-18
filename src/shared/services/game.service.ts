import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';

@Injectable()
export class GameService {
  private games: Game[] = [
    {gameId: 1, date: '2016-02-18T15:30:33.695Z', coreSetCount: 3, deckTypeId: 1},
    {gameId: 2, date: '2016-02-17T15:30:33.695Z', coreSetCount: 3, deckTypeId: 1},
    {gameId: 3, date: '2016-02-16T15:30:33.695Z', coreSetCount: 3, deckTypeId: 1},
    {gameId: 4, date: '2016-02-15T15:30:33.695Z', coreSetCount: 3, deckTypeId: 1},
  ];

  getGames(): Game[] {
    return this.games;
  }
}
