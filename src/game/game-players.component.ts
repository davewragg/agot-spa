import {Component, Input, OnInit} from 'angular2/core';
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

  players:Player[];
  agendas:Agenda[];
  factions:Faction[];

  addActive:boolean = true;

  constructor(private _ReferenceDataService:ReferenceDataService) {
    // TODO probably async
    this.players = this._ReferenceDataService.getPlayers();
    this.factions = this._ReferenceDataService.getFactions();
    this.agendas = this._ReferenceDataService.getAgendas();
  }

  ngOnInit() {
    // TODO
  }

  onWinnerChange(newWinner:GamePlayer) {
    this.gamePlayers.forEach((gamePlayer:GamePlayer) => {
      gamePlayer.isWinner = (gamePlayer === newWinner);
    });
    // TODO emit change for parent component (dirty)
  }

  onRemove(playerIndex:number) {
    this.gamePlayers.splice(playerIndex, 1);
    // TODO emit change for parent component (dirty)
  }

  onNewPlayerAdd(newPlayer:GamePlayer) {
    console.log(newPlayer);
    //TODO proper validation here
    if (!newPlayer || !this.validateNewPlayer(newPlayer)) {
      return false;
    }
    this.gamePlayers.push(newPlayer);
    this.resetForm();
    // TODO emit change for parent component (dirty)
  }

  private resetForm() {
    this.addActive = false;
    setTimeout(() => {
      this.addActive = true;
    }, 0);
  };

  private validateNewPlayer(newPlayer:GamePlayer) {
    // validate unique player
    if (this.gamePlayers.find((gamePlayer) => gamePlayer.player.playerId === +newPlayer.playerId)) {
      console.warn('player already listed');
      return false;
    }
    return true;
  }
}
