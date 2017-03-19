import { GamePlayer } from './game-player.model';
import { Venue } from './venue.model';

export class Game {
  gameId: number;
  date: string = new Date().toISOString(); //ISO STRING
  venueId: number;
  venue?: Venue;
  gamePlayers: GamePlayer[] = [];

  static patchValues(source: Game, changes: any): Game {
    const updatedGame: Game = Object.assign({}, source, changes);
    updatedGame.venueId = +updatedGame.venueId;
    // cloneGamePlayers?
    return updatedGame;
  }
}
