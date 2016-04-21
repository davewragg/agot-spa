import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NotificationService} from '../shared/services/notification.service';
import {GamePlayer} from '../shared/models/game-player.model';
import {NewGamePlayerFormComponent} from './new-game-player-form.component';
import {GamePlayerRowComponent} from './game-player-row.component';

@Component({
  selector: 'agot-game-players',
  templateUrl: 'game/game-players.html',
  directives: [GamePlayerRowComponent, NewGamePlayerFormComponent]
})
export class GamePlayersComponent {
  @Input()
  gamePlayers:GamePlayer[];
  @Input()
  readOnly:boolean = false;
  @Output()
  playerChange:EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  addActive:boolean = true;

  constructor(private notificationService:NotificationService) {
  }

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
      return;
    }
    if (this.gamePlayers.length < 1) {
      newPlayer.isWinner = true;
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
      this.notificationService.warn('Nope', 'player already listed');
      return false;
    }
    return true;
  }
}
