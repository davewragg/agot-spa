import {Faction} from './faction.model';
import {Agenda} from './agenda.model';
export interface DeckClass {
  factionId:number;
  faction?:Faction;
  agendaId?:number;
  agenda?:Agenda;
  secondaryFactionId?:number;
  secondaryFaction:Faction;
}
