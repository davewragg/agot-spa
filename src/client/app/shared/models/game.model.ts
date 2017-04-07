import { cloneDeep } from 'lodash';
import { GamePlayer } from './game-player.model';
import { Venue } from './venue.model';

export class Game {
  gameId: number;
  date: string = Game.getDateAsIsoString(new Date()); //ISO STRING
  venueId: number = null;
  venue?: Venue;
  gamePlayers: GamePlayer[] = [];

  static patchValues(source: Game, changes: any): Game {
    const updatedGame: Game = Object.assign({}, source, changes);
    updatedGame.venueId = +updatedGame.venueId;
    if ('gamePlayers' in changes) {
      updatedGame.gamePlayers = cloneDeep(updatedGame.gamePlayers);
    }
    return updatedGame;
  }

  static getDateAsIsoString(date: Date) {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  }
}
