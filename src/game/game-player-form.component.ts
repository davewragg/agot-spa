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

  onPlayerDataChange() {
    this.playerChange.emit(this.gamePlayers);
  }

  onSubmit() {
    const newPlayer:GamePlayer = this.newPlayerForm.value;
    //TODO proper validation here
    if (!this.validateNewPlayer(newPlayer)) {
      return false;
    }
    this.populateNewPlayer(newPlayer);
    this.addNewPlayer(newPlayer);
    // reset form
    //this.newPlayerForm.reset
  }

  private addNewPlayer(newPlayer:GamePlayer) {
    console.log(newPlayer);
    this.gamePlayers.push(newPlayer);
    this.onPlayerDataChange();
  };

  private populateNewPlayer(newPlayer:GamePlayer) {
    newPlayer.player = this.players.find((player) => player.playerId === +newPlayer.playerId);
    newPlayer.faction = this.factions.find((faction) => faction.factionId === +newPlayer.factionId);
    if (newPlayer.agendaId) {
      newPlayer.agenda = this.agendas.find((agenda) => agenda.agendaId === +newPlayer.agendaId);
    }
    if (newPlayer.secondFactionId) {
      newPlayer.secondaryFaction = this.factions.find((faction) => faction.factionId === +newPlayer.secondFactionId);
    }
  };

  private validateNewPlayer(newPlayer:GamePlayer) {
    // validate unique player
    if (this.gamePlayers.find((gamePlayer) => gamePlayer.player.playerId === +newPlayer.playerId)) {
      console.warn('player already listed');
      return false;
    }
    // validate agenda XOR secondary faction
    if (newPlayer.agendaId && newPlayer.secondFactionId) {
      console.warn('pick one');
      return false;
    }
    // validate banner is not the same as main faction
    if (newPlayer.agendaId === newPlayer.factionId) {
      console.warn('invalid banner');
      return false;
    }
    // validate faction 1 != faction 2
    if (newPlayer.factionId && newPlayer.secondFactionId) {
      console.warn('invalid second faction');
      return false;
    }
    return true;
  }
}
