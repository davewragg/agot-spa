import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DeckStats } from '../shared/models/deck-stats.model';
import { Deck } from '../shared/models/deck.model';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'deck-stats.component.html',
})
export class DeckStatsComponent {
  @Input()
  deck: Deck;
  @Input()
  deckStats: DeckStats;
}
