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

  sort(asc?:boolean, byLosing?:boolean):PlayerStats {
    this.deckClassAs = this.sortMap(this.deckClassAs, asc, byLosing);
    this.deckClassVs = this.sortMap(this.deckClassVs, asc, byLosing);
    this.factionsVs = this.sortMap(this.factionsVs, asc, byLosing);
    this.factionsAs = this.sortMap(this.factionsAs, asc, byLosing);
    this.agendasVs = this.sortMap(this.agendasVs, asc, byLosing);
    this.agendasAs = this.sortMap(this.agendasAs, asc, byLosing);
    this.playersVs = this.sortMap(this.playersVs, asc, byLosing);
    return this;
  }

  sortMap(map:Map<number, Stats>, asc?:boolean, byLosing?:boolean) {
    const entries = Array.from(map);
    return new Map(entries.sort(sortStats));

    function sortStats(o1:Array, o2:Array) {
      const stats1:Stats = o1[1];
      const stats2:Stats = o2[1];

      let sortStat1 = stats1.winPercentage;
      let sortStat2 = stats2.winPercentage;
      if (byLosing) {
        sortStat1 = stats1.lossPercentage;
        sortStat2 = stats2.lossPercentage;
      }

      if (asc) {
        return sortStat1 === sortStat2 ? stats1.played - stats2.played :
        sortStat1 - sortStat2;
      }
      return sortStat1 === sortStat2 ? stats2.played - stats1.played :
      sortStat2 - sortStat1;
    }
  }
}
