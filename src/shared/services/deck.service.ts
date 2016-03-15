import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Deck} from '../models/deck.model';

@Injectable()
export class DeckService {
  private data:Observable<Deck[]>;

  //private baseUrl = '<%= ENV %>' === 'prod' ? '' : '//paulhoughton.org/agot';
  private baseUrl = '//paulhoughton.org/agot';

  constructor(private http:Http) {
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

  getDecks():Observable<Deck[]> {
    console.log('getdecks called');
    if (!this.data) {
      this.data = this._getDecks();
    }
    return this.data;
  }

  private _getDecks():Observable<Deck[]> {
    console.log('_getdecks called');
    return this.http.get(this.baseUrl + '/api/decks/getall')
      .map((res:Response) => res.json().payload)
      .map((deckObjects:any[]) => deckObjects.map((deckObj:any) => Object.assign(new Deck(), deckObj)))
      .share();
  }
}
