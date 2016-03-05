import {Component, OnInit, Input} from 'angular2/core';
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
import {PlayerStatsSet} from '../shared/models/player-stats-set.model';

@Component({
  selector: 'agot-player-stats-table',
  moduleId: module.id,
  templateUrl: './player-stats-table.html',
  directives: [FactionBadgeComponent, AgendaBadgeComponent, DeckClassBadgeComponent,
    PlayerLinkComponent, ColourRangeDirective]
})
export class PlayerStatsTableComponent implements OnInit {
  @Input()
  title:string;
  @Input()
  playerStatsSet:PlayerStatsSet;

  players:Player[];
  agendas:Agenda[];
  factions:Faction[];

  constructor(private _referenceDataService:ReferenceDataService, private _playerService:PlayerService) {
    // TODO probably async
    this.players = this._playerService.getPlayers();
    this.factions = this._referenceDataService.getFactions();
    this.agendas = this._referenceDataService.getAgendas();
  }

  getFaction(factionId:number):Faction {
    return this.factions.find((faction) => faction.factionId === factionId);
  }

  getAgenda(agendaId:number):Agenda {
    return this.agendas.find((agenda) => agenda.agendaId === agendaId);
  }

  getPlayer(playerId:number):Player {
    return this.players.find((player) => player.playerId === playerId);
  }

  getDeckClass(deckClassId:number):DeckClass {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    return new DeckClass(this.getFaction(ids.factionId), this.getAgenda(ids.agendaId));
  }

  ngOnInit() {
    // TODO?
  }
}
