import {ChangeDetectionStrategy, Component, Input} from 'angular2/core';
import {TimeAgoPipe} from '../shared/pipes/time-ago-pipe';
import {DateFormatPipe} from '../shared/pipes/date-format-pipe';
import {PlayerLinkComponent} from '../shared/components/player-link.component';
import {FactionBadgeComponent} from '../shared/components/faction-badge.component';
import {AgendaBadgeComponent} from '../shared/components/agenda-badge.component';
import {Deck} from '../shared/models/deck.model';
import {Observable} from 'rxjs/Observable';
import {Player} from '../shared/models/player.model';
import {PlayerService} from '../shared/services/player.service';
import {DeckClassBadgeComponent} from '../shared/components/deck-class-badge.component';
import {DeckLinkComponent} from '../shared/components/deck-link.component';

@Component({
  selector: 'agot-decks-table',
  moduleId: module.id,
  templateUrl: './decks-table.component.html',
  pipes: [TimeAgoPipe, DateFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    DeckLinkComponent,
    PlayerLinkComponent,
    FactionBadgeComponent,
    AgendaBadgeComponent,
    DeckClassBadgeComponent,
  ]
})
export class DecksTableComponent {
  @Input()
  decks:Deck[];

  constructor(private _playerService:PlayerService) {
  }

  getPlayer(playerId:number):Observable<Player> {
    return this._playerService.getPlayer(playerId);
  }
}
