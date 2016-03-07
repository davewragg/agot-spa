import {Stats} from './stats.model';
import {Game} from './game.model';
import {PlayerStatsSet} from './player-stats-set.model';
import {PlayerInsights} from './player-insights.model';

export class PlayerStats {
  games:Game[] = [];
  overall:Stats = new Stats();
  as:PlayerStatsSet = new PlayerStatsSet();
  vs:PlayerStatsSet = new PlayerStatsSet();
  insights:PlayerInsights = new PlayerInsights();

  sort(asc?:boolean, byLosing?:boolean):PlayerStats {
    this.as.sort(asc, byLosing);
    this.vs.sort(asc, byLosing);
    return this;
  }
}
