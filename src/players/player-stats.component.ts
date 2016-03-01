import {Component, OnInit, Input, ChangeDetectionStrategy} from 'angular2/core';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {PlayerService} from '../shared/services/player.service';
import {PlayerStats} from '../shared/models/player-stats.model';
import {Faction} from '../shared/models/faction.model';
import {Player} from '../shared/models/player.model';
import {Agenda} from '../shared/models/agenda.model';
import {FactionBadgeComponent} from '../shared/components/faction-badge.component';
import {AgendaBadgeComponent} from '../shared/components/agenda-badge.component';

@Component({
  selector: 'agot-player-stats',
  moduleId: module.id,
  templateUrl: './player-stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [FactionBadgeComponent, AgendaBadgeComponent]
})
export class PlayerStatsComponent implements OnInit {
  @Input()
  player:Player;
  @Input()
  playerStats:PlayerStats;

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

  ngOnInit() {
    console.log(this.playerStats);
  }
}
