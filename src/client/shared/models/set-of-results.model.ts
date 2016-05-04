import {Game} from './game.model';
import {PlayerRanking} from './player-ranking.model';
import {GameResult} from './game-result.model';

export interface SetOfResults {
  games: Game[];
  rankedPlayers: PlayerRanking[];
  rankedFactions: PlayerRanking[];
  rankedAgendas: PlayerRanking[];
  playerWinLossRecord: Map<number, GameResult[]>;
}
