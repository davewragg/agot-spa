import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Player } from '../models/player.model';
import { Deck } from '../models/deck.model';
import { PlayerGroup } from '../models/player-group.model';
import { Game } from '../models/game.model';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  selector: 'agot-current-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="passesChecks">
      <ng-content></ng-content>
    </ng-container>
  `
})
export class CurrentPlayerComponent implements OnChanges, OnDestroy {
  currentPlayer$: Observable<Player>;
  playerSub: Subscription;

  passesChecks: boolean;

  @Input()
  isGamePlayer: Game;
  @Input()
  isDeckOwner: Deck;
  @Input()
  isGroupAdmin: PlayerGroup;
  @Input()
  isGroupMember: PlayerGroup;
  @Input()
  allowSuperUserOverride: boolean = true;

  @Input()
  not: boolean = false;

  constructor(private store: Store<fromRoot.State>) {
    this.currentPlayer$ = store.select(fromRoot.getCurrentPlayer).filter(x => !!x);
    this.playerSub = this.currentPlayer$.subscribe(this.setCheckState.bind(this));
  }

  ngOnChanges() {
    let currentPlayer = this.getCurrentPlayer();
    this.setCheckState(currentPlayer);
  }

  ngOnDestroy() {
    this.playerSub.unsubscribe();
  }

  private setCheckState(currentPlayer: Player) {
    this.passesChecks = this.checkChecks(currentPlayer);
  }

  private checkChecks(currentPlayer: Player): boolean {
    if (!currentPlayer) {
      return false;
    }

    // TODO export logic to a service
    if (this.allowSuperUserOverride) {
      // TODO if is superuser, return true;
    }

    if (this.isGamePlayer) {
      const game = this.isGamePlayer;
      const gamePlayerIds = game.gamePlayers.map(x => x.playerId);
      const isGamePlayer = gamePlayerIds.includes(currentPlayer.playerId);
      if ((this.not && isGamePlayer) || (!this.not && !isGamePlayer)) {
        return false;
      }
    }

    if (this.isDeckOwner) {
      const deck = this.isDeckOwner;
      const isDeckOwner = deck.creatorId === currentPlayer.playerId;
      if ((this.not && isDeckOwner) || (!this.not && !isDeckOwner)) {
        return false;
      }
    }

    if (this.isGroupAdmin) {
      const group = this.isGroupAdmin;
      const adminGroups = currentPlayer.adminGroupIds;
      const isGroupAdmin = adminGroups.includes(group.id);
      if ((this.not && isGroupAdmin) || (!this.not && !isGroupAdmin)) {
        return false;
      }
    }

    if (this.isGroupMember) {
      const group = this.isGroupMember;
      const memberIds = currentPlayer.playerGroups.map(x => x.id);
      const groupMembers = group.players.map(x => x.playerId);
      const isGroupMember = memberIds.includes(group.id) || groupMembers.includes(currentPlayer.playerId);
      if ((this.not && isGroupMember) || (!this.not && !isGroupMember)) {
        return false;
      }
    }

    return true;
  }

  private getCurrentPlayer(): Player {
    let currentPlayer;
    this.currentPlayer$.subscribe(x => currentPlayer = x);
    return currentPlayer;
  }
}
