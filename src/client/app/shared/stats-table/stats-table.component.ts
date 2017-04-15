import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Faction } from '../models/faction.model';
import { Player } from '../models/player.model';
import { Agenda } from '../models/agenda.model';
import { DeckClass } from '../models/deck-class.model';
import { StatsSet } from '../models/stats-set.model';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-stats-table',
  templateUrl: 'stats-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsTableComponent {
  @Input()
  title: string;
  @Input()
  statsSet: StatsSet;

  players: { [id: string]: Player };
  agendas: { [id: number]: Agenda };
  factions: { [id: number]: Faction };

  constructor(private store: Store<fromRoot.State>) {
    this.store.select(fromRoot.getPlayerEntities).subscribe(x => this.players = x);
    this.store.select(fromRoot.getAgendas).subscribe(x => this.agendas = x);
    this.store.select(fromRoot.getFactions).subscribe(x => this.factions = x);
  }

  getFaction(factionId: number): Faction {
    return this.factions[factionId];
  }

  getAgenda(agendaId: number): Agenda {
    return this.agendas[agendaId];
  }

  getPlayer(playerId: string): Player {
    return this.players[playerId];
  }

  getDeckClass(deckClassId: number): DeckClass {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    const faction = this.getFaction(ids.factionId);
    const agenda = this.getAgenda(ids.agendaId);
    return new DeckClass(faction, agenda);
  }
}
