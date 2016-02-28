import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Game} from '../../shared/models/game.model';
import {DateFormatPipe} from '../../shared/pipes/date-format-pipe';
import {FactionBadgeComponent} from '../../shared/components/faction-badge.component';

@Component({
  selector: 'agot-games-table',
  moduleId: module.id,
  templateUrl: './games-table.html',
  pipes: [DateFormatPipe],
  directives: [ROUTER_DIRECTIVES, FactionBadgeComponent]
})
export class GamesTableComponent {
  @Input()
  games:Game[];
}
