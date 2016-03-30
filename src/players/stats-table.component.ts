import {Component, Input} from 'angular2/core';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {PlayerService} from '../shared/services/player.service';
import {Faction} from '../shared/models/faction.model';
import {Player} from '../shared/models/player.model';
import {Agenda} from '../shared/models/agenda.model';
import {FactionBadgeComponent} from '../shared/components/faction-badge.component';
import {AgendaBadgeComponent} from '../shared/components/agenda-badge.component';
import {PlayerLinkComponent} from '../shared/components/player-link.component';
import {ColourRangeDirective} from '../shared/directives/colour-range.directive';
import {DeckClass} from '../shared/models/deck-class.model';
import {DeckClassBadgeComponent} from '../shared/components/deck-class-badge.component';
import {StatsSet} from '../shared/models/stats-set.model';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'agot-stats-table',
  moduleId: module.id,
  templateUrl: './stats-table.component.html',
  directives: [FactionBadgeComponent, AgendaBadgeComponent, DeckClassBadgeComponent,
    PlayerLinkComponent, ColourRangeDirective]
})
export class StatsTableComponent {
  @Input()
  title:string;
  @Input()
  statsSet:StatsSet;

  constructor(private _referenceDataService:ReferenceDataService, private _playerService:PlayerService) {
  }

  getFaction(factionId:number):Observable<Faction> {
    return this._referenceDataService.getFaction(factionId);
  }

  getAgenda(agendaId:number):Observable<Agenda> {
    return this._referenceDataService.getAgenda(agendaId);
  }

  getPlayer(playerId:number):Observable<Player> {
    return this._playerService.getPlayer(playerId);
  }

  getDeckClass(deckClassId:number):Observable<DeckClass> {
    return this._referenceDataService.getDeckClass(deckClassId);
  }
}
