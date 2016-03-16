import {Faction} from './faction.model';
import {Agenda} from './agenda.model';
export class Deck {
  deckId:number;
  faction:Faction;
  factionId:number;
  agenda:Agenda;
  agendaId:number;
  coreSetCount:number = 3;
  deckTypeId:number = 3;
  title:string;
  fallbackTitle:string;
  thronesDbId:number;
  thronesDbLink:string;
  thronesDbVersion:string;
  creatorId:number;
  // legacy
  secondFactionId:number;
  secondaryFaction:Faction;
}