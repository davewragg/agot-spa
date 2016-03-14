import {Injectable} from 'angular2/core';
import {DeckType} from '../models/deck-type.model';
import {Faction} from '../models/faction.model';
import {Agenda} from '../models/agenda.model';
import {DeckClass} from '../models/deck-class.model';

@Injectable()
export class ReferenceDataService {
  //constructor() {}

  getDeckTypes():DeckType[] {
    return [
      {deckTypeId: 1, title: 'Tutorial'},
      {deckTypeId: 2, title: 'Kingslayer'},
      {deckTypeId: 3, title: 'Tournament'},
    ];
  }

  getFactions():Faction[] {
    return [
      {
        factionId: 1,
        name: 'Greyjoy',
        thronesDbCode: 'greyjoy',
        thronesDbId: 3
      }, {
        factionId: 2,
        name: 'Targaryen',
        thronesDbCode: 'targaryen',
        thronesDbId: 8
      }, {
        factionId: 3,
        name: 'Baratheon',
        thronesDbCode: 'baratheon',
        thronesDbId: 2
      }, {
        factionId: 4,
        name: 'Stark',
        thronesDbCode: 'stark',
        thronesDbId: 7
      }, {
        factionId: 5,
        name: 'Martell',
        thronesDbCode: 'martell',
        thronesDbId: 5
      }, {
        factionId: 6,
        name: 'Lannister',
        thronesDbCode: 'lannister',
        thronesDbId: 4
      }, {
        factionId: 7,
        name: 'Nights Watch',
        thronesDbCode: 'nightswatch',
        thronesDbId: 6
      }, {
        factionId: 8,
        name: 'Tyrell',
        thronesDbCode: 'tyrell',
        thronesDbId: 9
      }
    ];
  }

  getAgendas():Agenda[] {
    return [
      {
        agendaId: 1, title: 'Banner of the Kraken', thronesDbCode: '01199'
      }, {
        agendaId: 2,
        title: 'Banner of the Dragon',
        thronesDbCode: '01204'
      }, {
        agendaId: 3, title: 'Banner of the Stag', thronesDbCode: '01198'
      }, {
        agendaId: 4,
        title: 'Banner of the Wolf',
        thronesDbCode: '01203'
      }, {
        agendaId: 5, title: 'Banner of the Sun', thronesDbCode: '01201'
      }, {
        agendaId: 6,
        title: 'Banner of the Lion',
        thronesDbCode: '01200'
      }, {
        agendaId: 7, title: 'Banner of the Watch', thronesDbCode: '01202'
      }, {
        agendaId: 8,
        title: 'Banner of the Rose',
        thronesDbCode: '01205'
      }, {
        agendaId: 9, title: 'Fealty', thronesDbCode: '01027'
      }, {
        agendaId: 10,
        title: 'The Lord of the Crossing',
        thronesDbCode: '02060'
      }
    ];
  }

  getFaction(factionId:number):Faction {
    return this.getFactionBy('factionId', factionId);
  }

  getFactionBy(field:string, value:number | string):Faction {
    return this.getFactions().find((faction) => faction[field] === value);
  }

  getAgenda(agendaId:number):Agenda {
    return this.getAgendaBy('agendaId', agendaId);
  }

  getAgendaBy(field:string, value:number | string):Agenda {
    return this.getAgendas().find((agenda) => agenda[field] === value);
  }

  getDeckClass(deckClassId:number):DeckClass {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    return new DeckClass(this.getFaction(ids.factionId), this.getAgenda(ids.agendaId));
  }
}
