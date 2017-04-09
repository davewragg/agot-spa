import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ThronesDbService } from '../shared/services/thrones-db.service';
import { Deck } from '../shared/models/deck.model';

@Component({
  moduleId: module.id,
  selector: 'agot-decks-table',
  templateUrl: 'decks-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecksTableComponent {
  @Input()
  decks: Deck[];

  sanitiseThronesDbLink(deck: Deck) {
    return ThronesDbService.sanitiseThronesDbLink(deck);
  }
}
