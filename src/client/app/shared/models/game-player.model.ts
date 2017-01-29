import { Player } from './player.model';
import { Deck } from './deck.model';

export interface GamePlayer {
  gamePlayerId?: number;
  player: Player;
  playerId: string;
  isWinner: boolean;
  deck: Deck;
  deckId: number;
  thronesDbVersion: number;
}
