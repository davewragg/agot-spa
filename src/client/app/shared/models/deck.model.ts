import { Faction } from './faction.model';
import { Agenda } from './agenda.model';
export class Deck {
  deckId: number;
  faction: Faction;
  factionId: number;
  agenda: Agenda;
  agendaId: number;
  deckTypeId: number = 3;
  title: string;
  fallbackTitle: string;
  thronesDbId: number;
  thronesDbLink: string;
  creatorId: string;
  dateCreated: string;
  dateModified: string;
  [key: string]: string | number | Faction | Agenda;

  static patchValues(source: Deck, changes: any): Deck {
    const updatedDeck: Deck = Object.assign({}, source, changes);
    return ['factionId', 'agendaId', 'thronesDbId']
      .reduce((memo, numericKey) => {
        memo[numericKey] = memo[numericKey] && +memo[numericKey];
        return memo;
      }, updatedDeck);
  }
}
