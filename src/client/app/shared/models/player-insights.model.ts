import { Faction } from './faction.model';
import { Agenda } from './agenda.model';
import { DeckClassStats } from './deck-class-stats.model';
import { Deck } from './deck.model';

interface DeckStats {
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

export class PlayerInsights {
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  gamesPlayed: number;
  winPercentage:  number;
  lossPercentage:  number;
  factionsNotPlayed: number[];
  agendasNotPlayed: number[];
  mostUsedDeck: DeckStats;
  mostSuccessfulDeck: DeckStats;
  leastSuccessfulDeck: DeckStats;
  mostBeatenDeck: DeckStats;
  mostLostToDeck: DeckStats;
  deckResults: DeckResult[];

  // legacy
  mostUsedDeckClass: DeckClassStats;
  mostSuccessfulDeckClass: DeckClassStats;
  leastSuccessfulDeckClass: DeckClassStats;
  bestResultsVsDeckClass: DeckClassStats;
  worstResultsVsDeckClass: DeckClassStats;
  neverPlayedFactions: Faction[] = [];
  neverPlayedAgendas: Agenda[] = [];
}
