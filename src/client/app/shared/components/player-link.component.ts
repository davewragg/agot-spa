import { Component, Input } from '@angular/core';
import { Player } from '../models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-link',
  template: `<a [routerLink]="['/PlayerDetails', {id: player?.playerId}]">{{ player?.name || player?.playerName || 'Player' }}</a>`,
})
export class PlayerLinkComponent {
  @Input()
  player: Player;
}
