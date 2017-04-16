import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { cloneDeep, get } from 'lodash';
import { Deck } from '../../shared/models/deck.model';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-existing-deck-selector',
  templateUrl: 'existing-deck-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingDeckSelectorComponent implements OnInit {
  @Input()
  playerId: string;

  @Input()
  set existingDeck(deck: Deck) {
    this.chosenDeck = cloneDeep(deck);
  }

  @Output()
  selectDeck: EventEmitter<Deck> = new EventEmitter<Deck>();

  showDecksFor: ViewDecksType = ViewDecksType.ME;
  viewDecksType = ViewDecksType;

  myDecks$: Observable<Deck[]>;
  groupDecks$: Observable<Deck[]>;
  // allDecks$: Observable<Deck[]>;
  loading$: Observable<boolean>;

  chosenDeck: Deck;

  constructor(private store: Store<fromRoot.State>) {
    this.myDecks$ = store.select(fromRoot.getFilteredDecks);
    this.groupDecks$ = store.select(fromRoot.getGroupDecks);
    // this.allDecks$ = store.select(fromRoot.getAllDecks);
    this.loading$ = store.select(fromRoot.getDecksLoading);
  }

  ngOnInit() {
    // check whether we have a deck already, and whether it's mine
    const creatorId = get(this.existingDeck, 'creatorId');
    if (creatorId && creatorId !== this.playerId) {
      this.showDecksFor = ViewDecksType.GROUP;
    }
  }

  setShowDecks(state: ViewDecksType) {
    this.showDecksFor = state;
  }

  onDeckSelect(deck: Deck) {
    console.log(deck);
    this.chosenDeck = deck;
  }

  onConfirm() {
    this.selectDeck.emit(this.chosenDeck);
  }
}

enum ViewDecksType {
  ME, GROUP/*, EVERYONE*/
}
