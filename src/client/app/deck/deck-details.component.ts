import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import * as fromRoot from '../state-management/reducers/root';
import { Deck } from '../shared/models/deck.model';
import { go } from '@ngrx/router-store';
import * as deckActions from '../state-management/actions/deck';

@Component({
  selector: 'agot-deck-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-1">
      <h2>Edit Deck</h2>
    
      <agot-deck-edit-form [deck]="deck$ | async"
                           [editing]="true" [creating]="false"
                           (cancel)="onCancel()" [hidden]="loading$ | async"
                           (updateDeck)="onSubmit()"></agot-deck-edit-form>
    
      <agot-spinner [isRunning]="loading$ | async"></agot-spinner>
    </div>
  `
})
export class DeckDetailsComponent {
  deck$: Observable<Deck>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) {
    this.deck$ = store.select(fromRoot.getDeckForEdit);
    this.loading$ = store.select(fromRoot.getDecksLoading);
  }

  onCancel() {
    this.store.dispatch(go(['decks', this.route.snapshot.params['id']]));
  }

  onSubmit() {
    let deck: Deck;
    // get from store synchronously
    this.deck$.subscribe((currentDeck) => deck = currentDeck);
    this.store.dispatch(new deckActions.SaveUpdateAction(deck));
  }
}
