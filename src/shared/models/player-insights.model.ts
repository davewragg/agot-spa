import {Faction} from './faction.model';
import {Agenda} from './agenda.model';
import {DeckClass} from './deck-class.model';

export class PlayerInsights {
  mostUsedDeckClass:DeckClass;
  mostSuccessfulDeckClass:DeckClass;
  leastSuccessfulDeckClass:DeckClass;
  bestResultsVsDeckClass:DeckClass;
  worstResultsVsDeckClass:DeckClass;
  neverPlayedFactions:Faction[] = [];
  neverPlayedAgendas:Agenda[] = [];
}
