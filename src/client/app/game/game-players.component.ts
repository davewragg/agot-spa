import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationService } from '../shared/services/notification.service';
import { GamePlayer } from '../shared/models/game-player.model';
import { Player } from '../shared/models/player.model';
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

  playerToAdd$: Observable<GamePlayer>;
  editPlayerId$: Observable<string>;

  @Input()
  readOnly: boolean = false;

  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
    this.playerToAdd$ = store.select(fromRoot.getGamePlayerForEdit);
    this.editPlayerId$ = store.select(fromRoot.getGameForEditPlayerId);
  }

  onWinnerChange(newWinner?: GamePlayer) {
    this.store.dispatch(new gameActions.SetWinnerAction(newWinner));
  }

  onRemove(gamePlayer: GamePlayer) {
    this.store.dispatch(new gameActions.RemovePlayerAction(gamePlayer));
  }

  onPlayerEdit(updatedPlayer: GamePlayer) {
    // TODO emit set_deck? this is duplication
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
    // TODO handle this properly
    this.store.dispatch(new gamePlayerActions.ClearAction());
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
