import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  playerToAdd$: Observable<GamePlayer>;

  @Input()
  readOnly: boolean = false;
  @Output()
  playerChange: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
    this.playerToAdd$ = store.select(fromRoot.getGamePlayerForEdit);
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

  onNewPlayerAdd(playerId: string) {
    if (!playerId || !this.validateNewPlayer(playerId)) {
      return;
    }
    let newPlayer: GamePlayer;
    this.playerToAdd$.subscribe(x => newPlayer = x);
    this.store.dispatch(new gameActions.AddPlayerAction(newPlayer));
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
