import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Deck} from '../models/deck.model';
import {DataService} from './data.service';

@Injectable()
export class DeckService {
  private data:Observable<Deck[]>;

  static validateDeck(deck:Deck):string {
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

  constructor(private dataService:DataService) {
  }

  getDecksFor(playerId:number):Observable<Deck[]> {
    return this.getDecks().map((allDecks:Deck[]) => {
      return allDecks.filter((deck:Deck) => deck.creatorId === playerId);
    });
  }

  getDeckBy(field:string, value:string | number):Observable<Deck> {
    return this.getDecks().map((allDecks:Deck[]) => {
      return allDecks.find((deck:Deck) => deck[field] === value);
    });
  }

  getDeck(deckId:number):Observable<Deck> {
    return this.getDeckBy('deckId', deckId);
  }

  getDecks():Observable<Deck[]> {
    console.log('getdecks called');
    if (!this.data) {
      this.data = this._getDecks();
    }
    return this.data;
  }

  private _getDecks():Observable<Deck[]> {
    console.log('_getdecks called');
    return this.dataService.getReferenceData('decks')
      .map((deckObjects:any[]) => deckObjects.map((deckObj:any) => Object.assign(new Deck(), deckObj)))
      .share();
  }
}
