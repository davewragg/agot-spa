import {GamePlayer} from './game-player.model';

export interface Game {
  gameId?: number;
  date: string; //ISO STRING
  gamePlayers: GamePlayer[];
}
