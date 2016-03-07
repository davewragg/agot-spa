import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {NotificationService} from '../shared/services/notification.service';
import {PlayerService} from '../shared/services/player.service';
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
  private static validateGamePlayer(newPlayer:GamePlayer):string {
    // validate agenda XOR secondary faction
    if (+newPlayer.agendaId && newPlayer.secondFactionId) {
      return 'pick one';
    }
    // validate banner is not the same as main faction
    if (+newPlayer.agendaId === +newPlayer.factionId) {
      return 'invalid banner';
    }
    // validate faction 1 != faction 2
    if (+newPlayer.factionId === +newPlayer.secondFactionId) {
      return 'invalid second faction';
    }
  }

  constructor(private _formBuilder:FormBuilder,
              private _referenceDataService:ReferenceDataService,
              private _playerService:PlayerService,
              private _notificationService:NotificationService) {
    // TODO probably async
    this.players = this._playerService.getPlayers();
    this.factions = this._referenceDataService.getFactions();
    this.agendas = this._referenceDataService.getAgendas();
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
    const error = GamePlayerFormComponent.validateGamePlayer(updatedPlayer);
    if (error) {
      this._notificationService.warn('Nope', error);
      console.warn(error);
      return false;
    }

    // TODO update or create?
    Object.assign(this.gamePlayer, updatedPlayer);
    this.populatePlayer(this.gamePlayer);
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
    this.gamePlayerForm = this._formBuilder.group({
      playerId: [playerId, Validators.required],
      factionId: [factionId, Validators.required],
      agendaId: [agendaId],
      secondFactionId: [secondFactionId],
    });
  };

  private populatePlayer(gamePlayer:GamePlayer) {
    gamePlayer.player = this.players.find((player) => player.playerId === +gamePlayer.playerId);
    gamePlayer.faction = this.factions.find((faction) => faction.factionId === +gamePlayer.factionId);
    if (gamePlayer.agendaId) {
      gamePlayer.agenda = this.agendas.find((agenda) => agenda.agendaId === +gamePlayer.agendaId);
    } else {
      gamePlayer.agenda = null;
    }
    if (gamePlayer.secondFactionId) {
      gamePlayer.secondaryFaction = this.factions.find((faction) => faction.factionId === +gamePlayer.secondFactionId);
    } else {
      gamePlayer.secondaryFaction = null;
    }
  }
}
