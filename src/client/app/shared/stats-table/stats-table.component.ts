import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReferenceDataService } from '../services/reference-data.service';
import { PlayerService } from '../services/player.service';
import { Faction } from '../models/faction.model';
import { Player } from '../models/player.model';
import { Agenda } from '../models/agenda.model';
// import { FactionBadgeComponent } from '../shared/components/faction-badge.component';
// import { AgendaBadgeComponent } from '../shared/components/agenda-badge.component';
// import { PlayerLinkComponent } from '../shared/components/player-link.component';
// import { ColourRangeDirective } from '../shared/directives/colour-range.directive';
import { DeckClass } from '../models/deck-class.model';
// import { DeckClassBadgeComponent } from '../shared/components/deck-class-badge.component';
import { StatsSet } from '../models/stats-set.model';

@Component({
  moduleId: module.id,
  selector: 'agot-stats-table',
  templateUrl: 'stats-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // directives: [FactionBadgeComponent, AgendaBadgeComponent, DeckClassBadgeComponent,
  //   PlayerLinkComponent, ColourRangeDirective]
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
