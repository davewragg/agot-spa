import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../state-management/reducers/index';
import { Deck } from '../shared/models/deck.model';
import { DeckStats } from '../shared/models/deck-stats.model';

@Component({
  selector: 'agot-selected-deck-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-1">
      <agot-view-deck [deck]="deck$ | async"></agot-view-deck>
    </div>
    <agot-spinner [isRunning]="deckStatsLoading$ | async"></agot-spinner>
    <div [hidden]="deckStatsLoading$ | async" class="mb-1">
      <h5>Deck Stats</h5>
      <agot-deck-stats [deck]="deck$ | async" [deckStats]="deckStats$ | async"></agot-deck-stats>
    </div>
  `
})
export class SelectedDeckPageComponent {
  deck$: Observable<Deck>;
  deckStats$: Observable<DeckStats>;
  deckStatsLoading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.deck$ = store.select(fromRoot.getSelectedDeck);
    this.deckStats$ = store.select(fromRoot.getSelectedDeckStats);
    this.deckStatsLoading$ = store.select(fromRoot.getSelectedDeckStatsLoading);
  }
}
