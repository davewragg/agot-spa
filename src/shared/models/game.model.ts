import {DeckType} from './deck-type.model';
import {GamePlayer} from './game-player.model';

export interface Game {
  gameId?: number;
  date: string; //ISO STRING
  coreSetCount: number;
  deckType: DeckType;
  deckTypeId?: number;
  gamePlayers: GamePlayer[];
}
