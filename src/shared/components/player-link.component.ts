import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Player} from '../models/player.model';

@Component({
  selector: 'agot-player-link',
  moduleId: module.id,
  template: `<a [routerLink]="['/PlayerDetails', {id: player.playerId}]">{{ player.name || player.playerName }}</a>`,
  directives: [ROUTER_DIRECTIVES]
})
export class PlayerLinkComponent {
  @Input()
  player:Player;
}