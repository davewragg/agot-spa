export class Stats {
  played:number = 0;
  won:number = 0;
  drawn:number = 0;
  lost:number = 0;

  private static getPercentage(played:number, stat:number) {
    return played < 1 ? 0 :
      Math.floor((stat / played) * 100);
  };

  get winPercentage():number {
    return Stats.getPercentage(this.played, this.won);
  }

  get lossPercentage():number {
    return Stats.getPercentage(this.played, this.lost);
  }
}
