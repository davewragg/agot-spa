import {Faction} from './faction.model';
import {Agenda} from './agenda.model';
export class DeckClass {
  factionId:number;
  faction:Faction;
  agendaId:number;
  agenda:Agenda;

  static getDeckClassId(factionId:number, agendaId?:number):number {
    return +`${factionId}.${agendaId || '0'}`;
  };

  static getFactionAndAgendaId(deckClassId:number) {
    const ids = ('' + deckClassId).split('.');
    return {
      factionId: ids.length > 0 ? +ids[0] : 0,
      agendaId: ids.length > 1 ? +ids[1] : 0
    };
  }

  constructor(faction:Faction, agenda?:Agenda);
  constructor(factionId:number, agendaId?:number);
  constructor(factionOrId:any, agendaOrId?:any) {
    // TODO bin this generic nonsense?
    console.log(arguments);
    if (typeof factionOrId === 'number') {
      this.factionId = factionOrId;
    } else {
      this.faction = factionOrId;
      this.factionId = factionOrId.factionId;
    }
    if (typeof agendaOrId === 'number') {
      this.agendaId = agendaOrId;
    } else {
      this.agenda = agendaOrId;
      this.agendaId = agendaOrId.agendaId;
    }
  }

  get id():number {
    return DeckClass.getDeckClassId(this.factionId, this.agendaId);
  }

  get title():string {
    return `${this.faction && this.faction.factionName} ${(this.agenda && this.agenda.title) || 'No Agenda'}`;
  }

  equals(o2:DeckClass) {
    console.log(o2.id);
    return this.id === o2.id;
  }
}
