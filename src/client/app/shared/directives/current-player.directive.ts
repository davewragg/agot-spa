import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
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
export class CurrentPlayerComponent implements OnChanges {
  currentPlayer$: Observable<Player>;

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
  }

  ngOnChanges() {
    this.passesChecks = this.checkChecks();
  }

  checkChecks(): boolean {
    let currentPlayer = this.getCurrentPlayer();

    // TODO export logic to service
    if (this.allowSuperUserOverride) {
      // TODO if is superuser, return true;
    }

    if (this.isGamePlayer) {
      // TODO game logic here
    }

    if (this.isDeckOwner) {
      // TODO deck owner
    }

    if (this.isGroupAdmin) {
      // TODO group admin
    }

    if (this.isGroupMember) {
      const group = this.isGroupMember;
      const memberIds = currentPlayer.playerGroups.map((x: PlayerGroup) => x.id);
      const isGroupMember = !memberIds.includes(group.id);
      if ((!this.not && isGroupMember) || (this.not && !isGroupMember)) {
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
