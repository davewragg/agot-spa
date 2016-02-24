import {Component, Input, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {Player} from '../shared/models/player.model';
import {Agenda} from '../shared/models/agenda.model';
import {Faction} from '../shared/models/faction.model';
import {GamePlayer} from '../shared/models/game-player.model';
import {GamePlayerFormComponent} from './game-player-form.component';

@Component({
  selector: 'agot-game-players',
  moduleId: module.id,
  templateUrl: './game-players.html',
  directives: [GamePlayerFormComponent]
})
export class GamePlayersComponent implements OnInit {
  @Input()
  gamePlayers:GamePlayer[];

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

  onWinnerChange(newWinner:GamePlayer) {
    this.gamePlayers.forEach((gamePlayer:GamePlayer) => {
      gamePlayer.isWinner = (gamePlayer === newWinner);
    });
    // TODO emit change for parent component
  }

  onRemove(playerIndex:number) {
    this.gamePlayers.splice(playerIndex, 1);
  }

  onNewPlayerAdd(newPlayer) {
    //TODO proper validation here
    if (!this.validateNewPlayer(newPlayer)) {
      return false;
    }
    console.log(newPlayer);
    this.gamePlayers.push(newPlayer);
  }

  private validateNewPlayer(newPlayer:GamePlayer) {
    // validate unique player
    if (this.gamePlayers.find((gamePlayer) => gamePlayer.player.playerId === +newPlayer.playerId)) {
      console.warn('player already listed');
      return false;
    }
  }
}
