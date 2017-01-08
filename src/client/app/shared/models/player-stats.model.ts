import { Stats } from './stats.model';
import { Game } from './game.model';
import { StatsSet } from './stats-set.model';
import { PlayerInsights } from './player-insights.model';
import { Deck } from './deck.model';
import { Agenda } from './agenda.model';
import { Faction } from './faction.model';

interface DeckStat {
  deck: Deck;
  count: number;
  winPercent?: number;
}

interface DeckResult {
  deckId: number;
  deck: Deck;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  totalGamesPlayed: number;
  winPercentage: number;
  decksPlayed: Deck[];
}

export class PlayerStats {
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  gamesPlayed: number;
  winPercentage: number;
  lossPercentage: number;
  factionsNotPlayed: number[];
  agendasNotPlayed: number[];
  neverPlayedFactions: Faction[] = [];
  neverPlayedAgendas: Agenda[] = [];
  mostUsedDeck: DeckStat;
  mostSuccessfulDeck: DeckStat;
  leastSuccessfulDeck: DeckStat;
  mostBeatenDeck: DeckStat;
  mostLostToDeck: DeckStat;
  deckResults: DeckResult[];

  // legacy
  games: Game[] = [];
  overall: Stats = new Stats();
  as: StatsSet = new StatsSet();
  vs: StatsSet = new StatsSet();
  insights: PlayerInsights = new PlayerInsights();

  sort(asc?: boolean, byLosing?: boolean): PlayerStats {
    this.as.sort(asc, byLosing);
    this.vs.sort(asc, byLosing);
    return this;
  }
}
