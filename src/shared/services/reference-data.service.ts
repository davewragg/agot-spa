import {Injectable} from 'angular2/core';
import {DeckType} from '../models/deck-type.model';
import {Faction} from '../models/faction.model';
import {Agenda} from '../models/agenda.model';
import {DeckClass} from '../models/deck-class.model';
import {BehaviorSubject} from 'rxjs/Rx';
import {DataService} from './data.service';
import {Observable} from 'rxjs/Observable';
import {Venue} from '../models/venue.model';

@Injectable()
export class ReferenceDataService {
  private _factions$:BehaviorSubject<Faction[]> = new BehaviorSubject([]);
  private _agendas$:BehaviorSubject<Agenda[]> = new BehaviorSubject([]);
  private _venues$:BehaviorSubject<Venue[]> = new BehaviorSubject([]);

  constructor(private dataService:DataService) {
    this.loadInitialData();
  }

  get factions() {
    console.log('returning factions');
    return this._factions$.asObservable();
  }

  get agendas() {
    console.log('returning agendas');
    return this._agendas$.asObservable();
  }

  get venues() {
    console.log('returning venues');
    return this._venues$.asObservable();
  }

  getDeckTypes():DeckType[] {
    return [
      {deckTypeId: 1, title: 'Tutorial'},
      {deckTypeId: 2, title: 'Kingslayer'},
      {deckTypeId: 3, title: 'Tournament'},
    ];
  }

  getVenue(venueId:number):Observable<Venue> {
    return this._venues$.map((venues:Venue[]) => venues.find((venue:Venue) => venue.venueId === venueId));
  }

  getFaction(factionId:number):Observable<Faction> {
    return this.getFactionBy('factionId', factionId);
  }

  getFactionBy(field:string, value:number | string):Observable<Faction> {
    return this._factions$.map((factions:Faction[]) => factions.find((faction:Faction) => faction[field] === value));
  }

  getAgenda(agendaId:number):Observable<Agenda> {
    return this.getAgendaBy('agendaId', agendaId);
  }

  getAgendaBy(field:string, value:number | string):Observable<Agenda> {
    return this._agendas$.map((agendas:Agenda[]) => agendas.find((agenda:Agenda) => agenda[field] === value));
  }

  getDeckClass(deckClassId:number):Observable<DeckClass> {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    return Observable.combineLatest(
      this.getFaction(ids.factionId),
      this.getAgenda(ids.agendaId)
    ).map(([faction, agenda]:[Faction, Agenda]) => {
      return new DeckClass(faction, agenda);
    });
  }

  private loadInitialData() {
    this.dataService.getReferenceData('factions').subscribe(
      (factions:Faction[]) => {
        this._factions$.next(factions);
      },
      (err) => console.error(err)
    );
    this.dataService.getReferenceData('agendas').subscribe(
      (agendas:Agenda[]) => {
        this._agendas$.next(agendas);
      },
      (err) => console.error(err)
    );
    this.dataService.getReferenceData('venues').subscribe(
      (venues:Venue[]) => {
        this._venues$.next(venues);
      },
      (err) => console.error(err)
    );
  }
}
