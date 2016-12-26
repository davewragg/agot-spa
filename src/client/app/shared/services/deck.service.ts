import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Deck } from '../models/deck.model';
import { DataService } from './data.service';
import { FilterCriteria } from '../models/filter-criteria.model';

@Injectable()
export class DeckService {
  private data: Observable<Deck[]>;

  static validateDeck(deck: Deck): string {
    // validate agenda XOR secondary faction
    if (+deck.agendaId && deck.secondFactionId) {
      return 'pick one';
    }
    // validate banner is not the same as main faction
    if (+deck.agendaId === +deck.factionId) {
      return 'invalid banner';
    }
    // validate faction 1 != faction 2
    if (+deck.factionId === +deck.secondFactionId) {
      return 'invalid second faction';
    }
    return null;
  }

  constructor(private dataService: DataService) {
  }

  getDecksFor(playerId: number): Observable<Deck[]> {
    return this.getDecks().map((allDecks: Deck[]) => {
      return allDecks.filter((deck: Deck) => deck.creatorId === playerId);
    });
  }

  getDeckBy(field: string, value: string | number): Observable<Deck> {
    return this.getDecks().map((allDecks: Deck[]) => {
      return allDecks.find((deck: Deck) => deck[field] === value);
    });
  }

  getDeck(deckId: number): Observable<Deck> {
    return this.getDeckBy('deckId', deckId);
  }

  updateDeck(deck: Deck): Observable<Deck> {
    // TODO update current decks instead?
    this.invalidate();
    return this.dataService.updateDeck(deck);
  }

  invalidate() {
    console.log('invalidate decks cache');
    // this.data = this._getDecks();
    this.data = null;
  }

  getDecks(criteria?: FilterCriteria): Observable<Deck[]> {
    console.log('getdecks called', criteria);
    if (!this.data) {
      this.data = this._getDecks();
    }
    if (!criteria) {
      return this.data;
    }
    return this.data.map((decks: Deck[]) => {
      return decks.filter(filterDecks);
    });

    function filterDecks(deck: Deck) {
      return (criteria.playerIds.length ?
          criteria.playerIds.indexOf(deck.creatorId) > -1 : true) &&
        (criteria.factionIds.length ?
          criteria.factionIds.indexOf(deck.factionId) > -1 || criteria.factionIds.indexOf(deck.secondFactionId) > -1 : true) &&
        (criteria.agendaIds.length ?
          criteria.agendaIds.indexOf(deck.agendaId) > -1 : true);
    }
  }

  private _getDecks(): Observable<Deck[]> {
    console.log('_getdecks called');
    return this.dataService.getReferenceData('decks')
      .map((deckObjects: any[]) => deckObjects.map((deckObj: any) => Object.assign(new Deck(), deckObj)))
      .share();
  }
}
