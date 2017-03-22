import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from '../shared/services/notification.service';
import { GamePlayer } from '../shared/models/game-player.model';
import * as fromRoot from '../state-management/reducers/root';
import * as gameActions from '../state-management/actions/game';
import * as gamePlayerActions from '../state-management/actions/game-player';

@Component({
  moduleId: module.id,
  selector: 'agot-game-players',
  templateUrl: 'game-players.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePlayersComponent {
  @Input()
  gamePlayers: GamePlayer[];

  @Input()
  readOnly: boolean = false;
  @Output()
  playerChange: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  addActive: boolean = true;

  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
  }

  onWinnerChange(newWinner?: GamePlayer) {
    this.store.dispatch(new gameActions.SetWinnerAction(newWinner));
  }

  onRemove(gamePlayer: GamePlayer) {
    this.store.dispatch(new gameActions.RemovePlayerAction(gamePlayer));
  }

  onPlayerEdit(updatedPlayer: GamePlayer) {
    this.playerChange.emit(updatedPlayer);
  }

  onNewPlayerAdd(newPlayer: GamePlayer) {
    if (!newPlayer || !this.validateNewPlayer(newPlayer)) {
      return;
    }
    this.store.dispatch(new gameActions.AddPlayerAction(newPlayer));
    // TODO does this work?
    this.store.dispatch(new gamePlayerActions.ClearAction());
  }

  private resetForm() {
    this.addActive = false;
    setTimeout(() => {
      this.addActive = true;
    }, 0);
  };

  private validateNewPlayer(newPlayer: GamePlayer) {
    // validate unique player
    if (this.gamePlayers.find((gamePlayer) => gamePlayer.player.playerId === newPlayer.playerId)) {
      console.warn('player already listed');
      this.notificationService.warn('Nope', 'player already listed');
      return false;
    }
    return true;
  }
}
