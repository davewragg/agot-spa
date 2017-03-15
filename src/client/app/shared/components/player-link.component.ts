import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <a *ngIf="player" [routerLink]="['/player', player.playerId]">
        {{ player.name || player.playerName || 'Player' }}
      </a>`,
})
export class PlayerLinkComponent {
  @Input()
  player: Player;
}
