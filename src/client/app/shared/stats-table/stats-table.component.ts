import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReferenceDataService } from '../services/reference-data.service';
import { PlayerService } from '../services/player.service';
import { Faction } from '../models/faction.model';
import { Player } from '../models/player.model';
import { Agenda } from '../models/agenda.model';
import { DeckClass } from '../models/deck-class.model';
import { StatsSet } from '../models/stats-set.model';

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

  constructor(private _referenceDataService: ReferenceDataService, private _playerService: PlayerService) {
  }

  getFaction(factionId: number): Observable<Faction> {
    return this._referenceDataService.getFaction(factionId);
  }

  getAgenda(agendaId: number): Observable<Agenda> {
    return this._referenceDataService.getAgenda(agendaId);
  }

  getPlayer(playerId: number): Observable<Player> {
    return this._playerService.getPlayer(playerId);
  }

  getDeckClass(deckClassId: number): Observable<DeckClass> {
    return this._referenceDataService.getDeckClass(deckClassId);
  }
}
