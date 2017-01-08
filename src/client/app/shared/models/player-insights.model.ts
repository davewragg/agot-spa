import { Faction } from './faction.model';
import { Agenda } from './agenda.model';
import { DeckClassStats } from './deck-class-stats.model';

export class PlayerInsights {
  mostUsedDeckClass: DeckClassStats;
  mostSuccessfulDeckClass: DeckClassStats;
  leastSuccessfulDeckClass: DeckClassStats;
  bestResultsVsDeckClass: DeckClassStats;
  worstResultsVsDeckClass: DeckClassStats;
  neverPlayedFactions: Faction[] = [];
  neverPlayedAgendas: Agenda[] = [];
}
