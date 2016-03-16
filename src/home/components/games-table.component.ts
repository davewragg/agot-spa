import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Game} from '../../shared/models/game.model';
import {FactionBadgeComponent} from '../../shared/components/faction-badge.component';
import {AgendaBadgeComponent} from '../../shared/components/agenda-badge.component';
import {PlayerLinkComponent} from '../../shared/components/player-link.component';
import {TimeAgoPipe} from '../../shared/pipes/time-ago-pipe';
import {DateFormatPipe} from '../../shared/pipes/date-format-pipe';

@Component({
  selector: 'agot-games-table',
  moduleId: module.id,
  templateUrl: './games-table.html',
  pipes: [TimeAgoPipe, DateFormatPipe],
  directives: [ROUTER_DIRECTIVES, PlayerLinkComponent, FactionBadgeComponent, AgendaBadgeComponent]
})
export class GamesTableComponent {
  @Input()
  games:Game[];
}
