import {Stats} from './stats.model';
import {Game} from './game.model';
import {StatsSet} from './player-stats-set.model';

export class DeckStats {
  games:Game[] = [];
  overall:Stats = new Stats();
  as:StatsSet = new StatsSet();
  vs:StatsSet = new StatsSet();

  sort(asc?:boolean, byLosing?:boolean) {
    this.as.sort(asc, byLosing);
    this.vs.sort(asc, byLosing);
    return this;
  }
}
