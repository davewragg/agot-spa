import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from '../shared/services/player.service';
import { Deck } from '../shared/models/deck.model';
import { Player } from '../shared/models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-view-deck',
  templateUrl: 'view-deck.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .deck-block {
      background-repeat: no-repeat;
      background-position: top center;
      background-size: cover;
    }
  `],
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
