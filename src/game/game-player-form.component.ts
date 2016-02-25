import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
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
  gamePlayer:GamePlayer;
  @Output()
  updatePlayer:EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  gamePlayerForm:ControlGroup;
  creating:boolean = false;

  players:Player[];
  agendas:Agenda[];
  factions:Faction[];

  // TODO move to service
  private static validateGamePlayer(newPlayer:GamePlayer) {
    // validate agenda XOR secondary faction
    if (newPlayer.agendaId && newPlayer.secondFactionId) {
      console.warn('pick one');
      return false;
    }
    // validate banner is not the same as main faction
    if (newPlayer.agendaId === +newPlayer.factionId) {
      console.warn('invalid banner');
      return false;
    }
    // validate faction 1 != faction 2
    if (newPlayer.factionId === +newPlayer.secondFactionId) {
      console.warn('invalid second faction');
      return false;
    }
    return true;
  }

  constructor(private _FormBuilder:FormBuilder, private _ReferenceDataService:ReferenceDataService) {
    // TODO probably async
    this.players = this._ReferenceDataService.getPlayers();
    this.factions = this._ReferenceDataService.getFactions();
    this.agendas = this._ReferenceDataService.getAgendas();
  }

  ngOnInit() {
    if (!this.gamePlayer) {
      this.creating = true;
      this.gamePlayer = <GamePlayer>{};
    }
    this.populateForm();
  }

  onSubmit() {
    // FIXME newPlayer properties default to strings
    const updatedPlayer:GamePlayer = this.gamePlayerForm.value;
    //TODO proper validation here
    if (!GamePlayerFormComponent.validateGamePlayer(updatedPlayer)) {
      return false;
    }
    this.populatePlayer(updatedPlayer);

    // TODO update or create?
    Object.assign(this.gamePlayer, updatedPlayer);
    console.log(this.gamePlayer);
    this.updatePlayer.emit(this.gamePlayer);
    // reset form
    //this.gamePlayerForm.reset
  }

  private populateForm() {
    let playerId = this.gamePlayer.playerId || '';
    let factionId = this.gamePlayer.factionId || '';
    let agendaId = this.gamePlayer.agendaId || '';
    let secondFactionId = this.gamePlayer.secondFactionId || '';
    this.gamePlayerForm = this._FormBuilder.group({
      playerId: [playerId, Validators.required],
      factionId: [factionId, Validators.required],
      agendaId: [agendaId],
      secondFactionId: [secondFactionId],
    });
  };

  private populatePlayer(newPlayer:GamePlayer) {
    newPlayer.player = this.players.find((player) => player.playerId === +newPlayer.playerId);
    newPlayer.faction = this.factions.find((faction) => faction.factionId === +newPlayer.factionId);
    if (newPlayer.agendaId) {
      newPlayer.agenda = this.agendas.find((agenda) => agenda.agendaId === +newPlayer.agendaId);
    }
    if (newPlayer.secondFactionId) {
      newPlayer.secondaryFaction = this.factions.find((faction) => faction.factionId === +newPlayer.secondFactionId);
    }
  }
}
