import {Injectable} from 'angular2/core';
import {DeckType} from '../models/deck-type.model';
import {Faction} from '../models/faction.model';
import {Agenda} from '../models/agenda.model';
import {DeckClass} from '../models/deck-class.model';
import {BehaviorSubject} from 'rxjs/Rx';
import {DataService} from './data.service';

@Injectable()
export class ReferenceDataService {
  private _factions$:BehaviorSubject<Faction[]> = new BehaviorSubject([]);
  private _agendas$:BehaviorSubject<Agenda[]> = new BehaviorSubject([]);
  private _factions:Faction[];
  private _agendas:Agenda[];

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

  getDeckTypes():DeckType[] {
    return [
      {deckTypeId: 1, title: 'Tutorial'},
      {deckTypeId: 2, title: 'Kingslayer'},
      {deckTypeId: 3, title: 'Tournament'},
    ];
  }

  getFaction(factionId:number):Faction {
    return this.getFactionBy('factionId', factionId);
  }

  getFactionBy(field:string, value:number | string):Faction {
    // TODO guard against early calls
    return this._factions.find((faction) => faction[field] === value);
  }

  getAgenda(agendaId:number):Agenda {
    return this.getAgendaBy('agendaId', agendaId);
  }

  getAgendaBy(field:string, value:number | string):Agenda {
    // TODO guard against early calls
    return this._agendas.find((agenda) => agenda[field] === value);
  }

  getDeckClass(deckClassId:number):DeckClass {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    return new DeckClass(this.getFaction(ids.factionId), this.getAgenda(ids.agendaId));
  }

  private loadInitialData() {
    this.dataService.getReferenceData('factions').subscribe(
      (factions:Faction[]) => {
        this._factions$.next(factions);
        this._factions = factions;
      },
      (err) => console.error(err)
    );
    this.dataService.getReferenceData('agendas').subscribe(
      (agendas:Agenda[]) => {
        this._agendas$.next(agendas);
        this._agendas = agendas;
      },
      (err) => console.error(err)
    );
  }
}
