import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../shared/services/notification.service';
import { GamePlayer } from '../shared/models/game-player.model';
import { Player } from '../shared/models/player.model';
import * as fromRoot from '../state-management/reducers/root';
import * as gameActions from '../state-management/actions/game.actions';

@Component({
  moduleId: module.id,
  selector: 'agot-game-players',
  templateUrl: 'game-players.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePlayersComponent {
  @Input()
  gamePlayers: GamePlayer[];

  editPlayerId$: Observable<string>;

  @Input()
  readOnly: boolean = false;

  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
    this.editPlayerId$ = store.select(fromRoot.getGameForEditPlayerId);
  }

  onWinnerChange(newWinner?: GamePlayer) {
    this.store.dispatch(new gameActions.SetWinnerAction(newWinner));
  }

  onRemove(gamePlayer: GamePlayer) {
    this.store.dispatch(new gameActions.RemovePlayerAction(gamePlayer));
  }

  onPlayerEdit(updatedPlayer: GamePlayer) {
    this.store.dispatch(new gameActions.UpdatePlayerAction(updatedPlayer));
  }

  onEditPlayer(gamePlayer: GamePlayer) {
    this.store.dispatch(new gameActions.EditPlayerAction(gamePlayer));
  }

  onCancelEditPlayer() {
    this.store.dispatch(new gameActions.CancelEditPlayerAction());
  }

  onNewPlayerAdd(player: Player) {
    if (!player || !this.validateNewPlayer(player.playerId)) {
      return;
    }
    this.store.dispatch(new gameActions.AddPlayerAction(player));
  }

  private validateNewPlayer(newPlayerId: string) {
    // validate unique player
    if (this.gamePlayers.find((gamePlayer) => gamePlayer.playerId === newPlayerId)) {
      console.warn('player already listed');
      this.notificationService.warn('Nope', 'player already listed');
      return false;
    }
    return true;
  }
}
