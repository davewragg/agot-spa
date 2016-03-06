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

  constructor(faction:Faction, agenda?:Agenda) {
    this.faction = faction;
    this.factionId = faction.factionId;
    if (agenda) {
      this.agenda = agenda;
      this.agendaId = agenda.agendaId;
    }
  }

  get id():number {
    return DeckClass.getDeckClassId(this.factionId, this.agendaId);
  }

  get title():string {
    return `${this.faction && this.faction.factionName}, ${(this.agenda && this.agenda.title) || 'No Agenda'}`;
  }
}
