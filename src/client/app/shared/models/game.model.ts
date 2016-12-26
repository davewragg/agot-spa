import {GamePlayer} from './game-player.model';

export class Game {
  gameId:number;
  date:string = new Date().toISOString(); //ISO STRING
  venueId:number;
  gamePlayers:GamePlayer[] = [];
}
