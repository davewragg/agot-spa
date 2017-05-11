import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { CacheService } from './cache.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Deck } from '../models/deck.model';

@Injectable()
export class DeckService {

  constructor(private dataService: DataService,
              private cacheService: CacheService) {
  }

  getDecksFor(playerId: string): Observable<Deck[]> {
    const criteria = new FilterCriteria();
    criteria.playerIds = [playerId];
    return this.getDecks(criteria);
  }

  getDecksBy(config: Object): Observable<Deck[]> {
    const criteria = FilterCriteria.patchValues(undefined, config);
    return this.getDecks(criteria);
  }

  getDeckBy(config: Object): Observable<Deck> {
    return this.getDecksBy(config).map(([deck]) => deck);
  }

  getDeck(deckId: number): Observable<Deck> {
    return this.dataService.getDeck(deckId);
  }

  updateDeck(deck: Deck): Observable<Deck> {
    this.invalidate();
    return this.dataService.updateDeck(deck);
  }

  invalidate() {
    this.cacheService.invalidate();
  }

  getDecks(criteria?: FilterCriteria): Observable<Deck[]> {
    return this.cacheService.getFilteredData('decks', this.dataService.getDecks, criteria, this.dataService);
  }
}
