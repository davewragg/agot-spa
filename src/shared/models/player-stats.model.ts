import {Stats} from './stats.model';
import {Game} from './game.model';

export class PlayerStats {
  games:Game[] = [];
  overall:Stats = new Stats();
  deckClassAs:Map<number, Stats> = new Map<number, Stats>();
  deckClassVs:Map<number, Stats> = new Map<number, Stats>();
  factionsVs:Map<number, Stats> = new Map<number, Stats>();
  factionsAs:Map<number, Stats> = new Map<number, Stats>();
  agendasVs:Map<number, Stats> = new Map<number, Stats>();
  agendasAs:Map<number, Stats> = new Map<number, Stats>();
  playersVs:Map<number, Stats> = new Map<number, Stats>();
}
