import { Injectable } from '@angular/core';
import { isEqual } from 'lodash';
import { Faction } from '../models/faction.model';
import { Agenda } from '../models/agenda.model';
import { DeckClass } from '../models/deck-class.model';
import { BehaviorSubject } from 'rxjs/Rx';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Venue } from '../models/venue.model';
import { RefDataType } from './ref-data.type';
import { refDataStorage } from './ref-data-storage';

@Injectable()
export class ReferenceDataService {
  private _subjects$: { [id: string]: BehaviorSubject<any> } = {};

  constructor(private dataService: DataService) {
    // this.loadInitialData();
  }

  get factions(): Observable<Faction[]> {
    console.log('returning factions');
    return this.getRefData('factions');
  }

  get agendas(): Observable<Agenda[]> {
    console.log('returning agendas');
    return this.getRefData('agendas');
  }

  get venues(): Observable<Venue[]> {
    console.log('returning venues');
    return this.getRefData('venues');
  }

  getVenue(venueId: number): Observable<Venue> {
    return this.venues.map((venues: Venue[]) => venues.find((venue: Venue) => venue.venueId === venueId));
  }

  getFaction(factionId: number): Observable<Faction> {
    return this.getFactionBy('factionId', factionId);
  }

  getFactionBy(field: string, value: number | string): Observable<Faction> {
    return this.factions.map((factions: Faction[]) => factions.find((faction: Faction) => faction[field] === value));
  }

  getAgenda(agendaId: number): Observable<Agenda> {
    return this.getAgendaBy('agendaId', agendaId);
  }

  getAgendaBy(field: string, value: number | string): Observable<Agenda> {
    return this.agendas.map((agendas: Agenda[]) => agendas.find((agenda: Agenda) => agenda[field] === value));
  }

  getDeckClass(deckClassId: number): Observable<DeckClass> {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    return Observable.combineLatest(
      this.getFaction(ids.factionId),
      this.getAgenda(ids.agendaId)
    ).map(([faction, agenda]:[Faction, Agenda]) => {
      return new DeckClass(faction, agenda);
    });
  }

  private getRefData<T>(refDataType: RefDataType): Observable<T[]> {
    console.log('get ref data', refDataType);
    if (!this._subjects$[refDataType]) {
      this._subjects$[refDataType] = this.getViaCache(refDataType);
    }
    return this._subjects$[refDataType].asObservable();
  }

  private getViaCache<T>(refDataType: RefDataType): BehaviorSubject<T[]> {
    let subject: BehaviorSubject<T[]>;
    const localData: T[] = this.getFromLocal(refDataType);
    if (localData) {
      subject = new BehaviorSubject<T[]>(localData);
    }
    this.dataService.getReferenceData(refDataType)
      .subscribe((apiData: T[]) => {
          if (!isEqual(apiData, localData)) {
            if (!this._subjects$[refDataType]) {
              subject = new BehaviorSubject<T[]>(apiData);
            } else {
              subject.next(apiData);
            }
            this.setToLocal(refDataType, apiData);
          }
        },
        (err) => console.error(err)
      );
    return subject;
  }

  private setToLocal<T>(refDataType: RefDataType, apiData: T[]) {
    console.log('set ref data to local storage', refDataType, apiData);
    refDataStorage.setRefData(refDataType, apiData);
  }

  private getFromLocal(refDataType: RefDataType) {
    console.log('get ref data from local storage', refDataType);
    return refDataStorage.getRefData(refDataType);
  }

  private loadInitialData() {
    this.getViaCache('factions');
    this.getViaCache('agendas');
    this.getViaCache('venues');
  }
}
