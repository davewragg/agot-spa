import { Faction } from './faction.model';
import { Agenda } from './agenda.model';

export class DeckClass {
  private static ID_SEPARATOR = ':';

  factionId: number;
  faction: Faction;
  agendaId: number;
  agenda: Agenda;

  static getDeckClassId(factionId: number, agendaId?: number): string {
    return `${factionId}${DeckClass.ID_SEPARATOR}${agendaId || '0'}`;
  }

  static getFactionAndAgendaId(deckClassId: number) {
    const ids = ('' + deckClassId).split(DeckClass.ID_SEPARATOR);
    return {
      factionId: ids.length > 0 ? +ids[0] : 0,
      agendaId: ids.length > 1 ? +ids[1] : 0
    };
  }

  static getDeckClassTitle(faction: Faction, agenda?: Agenda): string {
    return `${faction && faction.name} / ${(agenda && agenda.title) || 'No Agenda'}`;
  }

  static getName(deckClass: DeckClass) {
    return DeckClass.getDeckClassTitle(deckClass.faction, deckClass.agenda);
  }

  constructor(faction: Faction, agenda?: Agenda) {
    if (faction) {
      this.faction = faction;
      this.factionId = faction.factionId;
    }
    if (agenda) {
      this.agenda = agenda;
      this.agendaId = agenda.agendaId;
    }
  }

  get id(): string {
    return DeckClass.getDeckClassId(this.factionId, this.agendaId);
  }

  get name(): string {
    return DeckClass.getName(this);
  }
}
