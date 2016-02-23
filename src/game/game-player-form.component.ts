import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {Player} from '../shared/models/player.model';
import {Agenda} from '../shared/models/agenda.model';
import {Faction} from '../shared/models/faction.model';
import {GamePlayer} from '../shared/models/game-player.model';

@Component({
  selector: 'agot-game-player-form',
  moduleId: module.id,
  templateUrl: './game-player-form.html'
})
export class GamePlayerFormComponent implements OnInit {
  @Input()
  gamePlayers:GamePlayer[];
  @Output()
  playerChange:EventEmitter<GamePlayer[]> = new EventEmitter<GamePlayer[]>();

  newPlayerForm:ControlGroup;

  players:Player[];
  agendas:Agenda[];
  factions:Faction[];

  constructor(private _FormBuilder:FormBuilder, private _ReferenceDataService:ReferenceDataService) {
    // TODO probably async
    this.players = this._ReferenceDataService.getPlayers();
    this.factions = this._ReferenceDataService.getFactions();
    this.agendas = this._ReferenceDataService.getAgendas();
  }

  ngOnInit() {
    this.newPlayerForm = this._FormBuilder.group({
      playerId: ['', Validators.required],
      factionId: ['', Validators.required],
      agendaId: [''],
      secondFactionId: [''],
    });
  }

  onSubmit() {
    const newPlayer = this.newPlayerForm.value;
    console.log(newPlayer);
    // validate unique player
    // validate agenda XOR secondary faction
    // set full player obj
    newPlayer.player = this.players.find((player) => player.playerId === +newPlayer.playerId);
    // set full agenda obj
    if (newPlayer.agendaId) {
      newPlayer.agenda = this.agendas.find((agenda) => agenda.agendaId === +newPlayer.agendaId);
    }
    // set full faction objs
    newPlayer.faction = this.factions.find((faction) => faction.factionId === +newPlayer.factionId);
    if (newPlayer.secondFactionId) {
      newPlayer.secondaryFaction = this.factions.find((faction) => faction.factionId === +newPlayer.secondFactionId);
    }

    this.gamePlayers.push(newPlayer);
    this.newPlayerForm.value = {};
  }

  onPlayerDataChange() {
    this.playerChange.emit(this.gamePlayers);
  }
}
