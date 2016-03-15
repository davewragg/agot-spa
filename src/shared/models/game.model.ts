import {GamePlayer} from './game-player.model';

export class Game {
  gameId:number;
  date:string = new Date().toISOString(); //ISO STRING
  gamePlayers:GamePlayer[] = [];
  // legacy
  coreSetCount:number = 3;
  deckTypeId:number = 3;
}
