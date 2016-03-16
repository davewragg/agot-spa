import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Deck} from '../models/deck.model';
import {Faction} from '../models/faction.model';
import {ReferenceDataService} from './reference-data.service';
import {Agenda} from '../models/agenda.model';

@Injectable()
export class ThronesDbService {
  private baseUrl = 'http://thronesdb.com';
  private thronesDbLinkBase = this.baseUrl + '/decklist/view/';

  private static handleResponse(response:Response):any {
    return response.json();
  }

  constructor(private http:Http, private referenceDataService:ReferenceDataService) {
  }

  getThronesDbDeck(deckId:number):Observable<ThronesDbDeck> {
    console.log('getThronesDbDeck called', deckId);
    return this.http.get(this.baseUrl + '/api/public/decklist/' + deckId)
      .map(ThronesDbService.handleResponse);
  }

  importAndConvertThronesDbDeck(deckId:number):Observable<Deck> {
    return Observable.combineLatest(
      this.referenceDataService.factions,
      this.referenceDataService.agendas,
      this.getThronesDbDeck(deckId)
    )
    .map(([factions, agendas, thronesDeck]:[Faction[], Agenda[], ThronesDbDeck]) => {
      const deck = new Deck();
      deck.title = thronesDeck.name;
      deck.thronesDbId = thronesDeck.id;
      deck.thronesDbVersion = thronesDeck.version;
      deck.thronesDbLink = this.thronesDbLinkBase + thronesDeck.id;
      // faction
      deck.faction = this.convertFaction(factions, thronesDeck.faction_code);
      deck.factionId = deck.faction.factionId;
      // agenda
      deck.agenda = this.convertAgenda(agendas, thronesDeck.agenda_code);
      if (!deck.agenda) {
        console.warn(`No agenda for ${thronesDeck.agenda_code}`);
      } else {
        deck.agendaId = deck.agenda.agendaId;
      }

      return deck;
    });
  }

  private convertFaction(factions:Faction[], thronesFactionCode:string):Faction {
    return factions.find((faction) => faction['thronesDbCode'] === thronesFactionCode);
  }

  private convertAgenda(agendas:Agenda[], thronesAgendaCode:string):Agenda {
    return agendas.find((agenda) => agenda['thronesDbCode'] === thronesAgendaCode);
  }
}

interface ThronesDbDeck {
  agenda_code: string;
  date_creation: string; // ISO
  date_update: string; // ISO
  description_md: string;
  faction_code: string;
  faction_name: string;
  id: number;
  name:  string;
  slots: Map<string, number>;
  user_id: number;
  version: string;
}
