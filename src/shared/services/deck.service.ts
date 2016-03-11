import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Deck} from '../models/deck.model';

@Injectable()
export class DeckService {
  private REMOTE_TIMEOUT = 30000;
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

  getDecks():Observable<Deck[]> {
    if (!this.data) {
      this.data = this._getDecks();
    }
    return this.data;
  }

  private _getDecks():Observable<Deck[]> {
    return this.http.get(this.baseUrl + '/api/decks/getall')
      .timeout(this.REMOTE_TIMEOUT, new Error('timed out web'))
      .map((res:Response) => res.json().payload)
      .map((deckObjects:any[]) => deckObjects.map((deckObj:any) => new Deck(deckObj)));
  }
}
