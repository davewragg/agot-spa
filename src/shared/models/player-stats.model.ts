import {Stats} from './stats.model';
import {Game} from './game.model';
import {StatsSet} from './player-stats-set.model';
import {PlayerInsights} from './player-insights.model';

export class PlayerStats {
  games:Game[] = [];
  overall:Stats = new Stats();
  as:StatsSet = new StatsSet();
  vs:StatsSet = new StatsSet();
  insights:PlayerInsights = new PlayerInsights();

  sort(asc?:boolean, byLosing?:boolean):PlayerStats {
    this.as.sort(asc, byLosing);
    this.vs.sort(asc, byLosing);
    return this;
  }
}
