import { Component, Input } from '@angular/core';
import { Deck } from '../shared/models/deck.model';
// import { TimeAgoPipe } from '../shared/pipes/time-ago-pipe';
// import { DateFormatPipe } from '../shared/pipes/date-format-pipe';
import { PlayerService } from '../shared/services/player.service';
import { Observable } from 'rxjs/Observable';
import { Player } from '../shared/models/player.model';
// import { PlayerLinkComponent } from '../shared/components/player-link.component';

@Component({
  selector: 'agot-view-deck',
  templateUrl: 'decks/view-deck.component.html',
  styles: [`
    .deck-block {
      background-repeat: no-repeat;
      background-position: top center;
      background-size: cover;
    }
  `],
  // pipes: [TimeAgoPipe, DateFormatPipe],
  // directives: [PlayerLinkComponent]
})
export class ViewDeckComponent {
  @Input()
  deck: Deck;

  constructor(private _playerService: PlayerService) {
  }

  getPlayer(playerId: number): Observable<Player> {
    return this._playerService.getPlayer(playerId);
  }
}
