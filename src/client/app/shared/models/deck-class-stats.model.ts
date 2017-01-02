import { DeckClass } from './deck-class.model';
import { Stats } from './stats.model';

export class DeckClassStats {
  constructor(private deckClass: DeckClass, private stats: Stats) {
  }
}
