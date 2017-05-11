import { cloneDeep } from 'lodash';
import { Player } from './player.model';
import { Deck } from './deck.model';

export class GamePlayer {
  gamePlayerId: number;
  player: Player;
  playerId: string;
  isWinner: boolean;
  deck: Deck;
  deckId: number;
  thronesDbVersion: number;

  static patchValues(source: GamePlayer, changes: any): GamePlayer {
    const updatedGamePlayer: GamePlayer = Object.assign({}, source, changes);
    updatedGamePlayer.deckId = +updatedGamePlayer.deckId;
    if ('player' in changes) {
      updatedGamePlayer.player = cloneDeep(updatedGamePlayer.player);
    }
    if ('deck' in changes) {
      updatedGamePlayer.deck = cloneDeep(updatedGamePlayer.deck);
    }
    // thronesDbVersion?
    return updatedGamePlayer;
  }
}
