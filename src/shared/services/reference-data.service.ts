import {Injectable} from 'angular2/core';
import {DeckType} from '../models/deck-type.model';
import {Player} from '../models/player.model';
import {Faction} from '../models/faction.model';
import {Agenda} from '../models/agenda.model';

@Injectable()
export class ReferenceDataService {
  //constructor() {}

  // TODO move to PlayerService
  getPlayers():Player[] {
    return [
      {playerId: 1, name: 'Fonz'},
      {playerId: 2, name: 'Dan'},
      {playerId: 3, name: 'Dave'},
      {playerId: 4, name: 'James'},
    ];
  }

  getDeckTypes():DeckType[] {
    return [
      {deckTypeId: 1, title: 'Tutorial'},
      {deckTypeId: 2, title: 'Kingslayer'},
      {deckTypeId: 3, title: 'Tournament'},
    ];
  }

  getFactions():Faction[] {
    return [
      {factionId: 1, factionName: 'Greyjoy'},
      {factionId: 2, factionName: 'Targaryen'},
      {factionId: 3, factionName: 'Baratheon'},
      {factionId: 4, factionName: 'Stark'},
      {factionId: 5, factionName: 'Martell'},
      {factionId: 6, factionName: 'Lannister'},
      {factionId: 7, factionName: 'Nights Watch'},
      {factionId: 8, factionName: 'Tyrell'},
    ];
  }

  getAgendas():Agenda[] {
    return [
      {agendaId: 1, title: 'Banner of the Kraken'},
      {agendaId: 2, title: 'Banner of the Dragon'},
      {agendaId: 3, title: 'Banner of the Stag'},
      {agendaId: 4, title: 'Banner of the Wolf'},
      {agendaId: 5, title: 'Banner of the Sun'},
      {agendaId: 6, title: 'Banner of the Lion'},
      {agendaId: 7, title: 'Banner of the Watch'},
      {agendaId: 8, title: 'Banner of the Rose'},
      {agendaId: 9, title: 'Fealty'},
      {agendaId: 10, title: 'Lords of the Crossing'},
    ];
  }
}
