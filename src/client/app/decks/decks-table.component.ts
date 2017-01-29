import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from '../shared/services/player.service';
import { Deck } from '../shared/models/deck.model';
import { Player } from '../shared/models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-decks-table',
  templateUrl: 'decks-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecksTableComponent {
  @Input()
  decks: Deck[];

  constructor(private _playerService: PlayerService) {
  }

  getPlayer(playerId: string): Observable<Player> {
    return this._playerService.getPlayer(playerId);
  }
}
