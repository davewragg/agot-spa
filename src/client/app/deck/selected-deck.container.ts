import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../state-management/reducers/index';
import { Deck } from '../shared/models/deck.model';

@Component({
  selector: 'agot-selected-deck-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-view-deck [deck]="deck$ | async"></agot-view-deck>
  `
})
export class SelectedDeckPageComponent {
  deck$: Observable<Deck>;

  constructor(private store: Store<fromRoot.State>) {
    this.deck$ = store.select(fromRoot.getSelectedDeck);
  }
}
