import {Stats} from './stats.model';
import {Game} from './game.model';

export interface PlayerStats {
  games: Game[];
  overall: Stats;
  factionsVs: Map<number, Stats>;
  factionsAs: Map<number, Stats>;
  agendasVs: Map<number, Stats>;
  agendasAs: Map<number, Stats>;
  playersVs: Map<number, Stats>;
}
