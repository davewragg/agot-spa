import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Deck } from '../../shared/models/deck.model';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-existing-deck-selector',
  templateUrl: 'existing-deck-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingDeckSelectorComponent {
  @Input()
  playerId: string;
  @Input()
  existingDeck: Deck;
  @Output()
  selectDeck: EventEmitter<Deck> = new EventEmitter<Deck>();

  showDecksFor: ViewDecksType = ViewDecksType.ME;
  viewDecksType = ViewDecksType;

  myDecks$: Observable<Deck[]>;
  groupDecks$: Observable<Deck[]>;
  allDecks$: Observable<Deck[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.myDecks$ = store.select(fromRoot.getFilteredDecks);
    this.groupDecks$ = store.select(fromRoot.getGroupDecks);
    this.allDecks$ = store.select(fromRoot.getAllDecks);
    this.loading$ = store.select(fromRoot.getDecksLoading);
  }

  setShowDecks(state: ViewDecksType) {
    this.showDecksFor = state;
  }

  onDeckSelect(deck: Deck) {
    console.log(deck);
    this.selectDeck.emit(deck);
  }
}

enum ViewDecksType {
  ME, GROUP, EVERYONE
}
