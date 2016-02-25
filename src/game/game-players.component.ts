import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {GamePlayer} from '../shared/models/game-player.model';
import {GamePlayerFormComponent} from './game-player-form.component';
import {GamePlayerRowComponent} from './game-player-row.component';

@Component({
  selector: 'agot-game-players',
  moduleId: module.id,
  templateUrl: './game-players.html',
  directives: [GamePlayerRowComponent, GamePlayerFormComponent]
})
export class GamePlayersComponent {
  @Input()
  gamePlayers:GamePlayer[];
  @Output()
  playerChange:EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  addActive:boolean = true;

  onWinnerChange(newWinner?:GamePlayer) {
    this.gamePlayers.forEach((gamePlayer:GamePlayer) => {
      gamePlayer.isWinner = (gamePlayer === newWinner);
    });
    this.playerChange.emit(newWinner);
  }

  onRemove(gamePlayer:GamePlayer) {
    const playerIndex = this.gamePlayers.indexOf(gamePlayer);
    if (playerIndex > -1) {
      this.gamePlayers.splice(playerIndex, 1);
      this.playerChange.emit(gamePlayer);
    }
  }

  onPlayerEdit(updatedPlayer:GamePlayer) {
    this.playerChange.emit(updatedPlayer);
  }

  onNewPlayerAdd(newPlayer:GamePlayer) {
    console.log(newPlayer);
    //TODO proper validation here
    if (!newPlayer || !this.validateNewPlayer(newPlayer)) {
      return false;
    }
    this.gamePlayers.push(newPlayer);
    this.resetForm();
    this.playerChange.emit(newPlayer);
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
