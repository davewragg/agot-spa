import { Stats } from './stats.model';

export class StatsSet {
  deckClass: Map<number, Stats> = new Map<number, Stats>();
  factions: Map<number, Stats> = new Map<number, Stats>();
  agendas: Map<number, Stats> = new Map<number, Stats>();
  players: Map<number, Stats> = new Map<number, Stats>();

  sort(asc?: boolean, byLosing?: boolean): StatsSet {
    this.deckClass = this.sortMap(this.deckClass, asc, byLosing);
    this.factions = this.sortMap(this.factions, asc, byLosing);
    this.agendas = this.sortMap(this.agendas, asc, byLosing);
    this.players = this.sortMap(this.players, asc, byLosing);
    return this;
  }

  sortMap(map: Map<number, Stats>, asc?: boolean, byLosing?: boolean): Map<number, Stats> {
    const entries = Array.from(<any>map);
    return new Map<number, Stats>(<any>entries.sort(sortStats));

    function sortStats(o1: Array<any>, o2: Array<any>) {
      const stats1: Stats = o1[1];
      const stats2: Stats = o2[1];

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
