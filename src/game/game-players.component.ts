import {Component, Input} from 'angular2/core';
import {GamePlayer} from '../shared/models/game-player.model';
import {GamePlayerFormComponent} from './game-player-form.component';

@Component({
  selector: 'agot-game-players',
  moduleId: module.id,
  templateUrl: './game-players.html',
  directives: [GamePlayerFormComponent]
})
export class GamePlayersComponent {
  @Input()
  gamePlayers:GamePlayer[];

  addActive:boolean = true;

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
