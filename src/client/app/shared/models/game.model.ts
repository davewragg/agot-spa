import { GamePlayer } from './game-player.model';
import { Venue } from './venue.model';

export class Game {
  gameId: number;
  date: string = new Date().toISOString(); //ISO STRING
  venueId: number;
  venue?: Venue;
  gamePlayers: GamePlayer[] = [];
}
