import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { DeckService } from '../../shared/services/deck.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Deck } from '../../shared/models/deck.model';
import * as fromRoot from '../../state-management/reducers/root';
import * as deckActions from '../../state-management/actions/deck.actions';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-selector',
  templateUrl: 'deck-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckSelectorComponent implements OnInit {
  @Input()
  creating: boolean;
  @Input()
  playerId: string;
  @Input()
  existingDeck: Deck;
  @Input()
  deckVersion: number;
  @Output()
  updateDeck: EventEmitter<{ deck: Deck, version: number }> = new EventEmitter<{ deck: Deck, version: number }>();

  deckSelection: DeckSelectionType = DeckSelectionType.EXISTING;
  deckSelectionType = DeckSelectionType;

  editDeck$: Observable<Deck>;

  private static getInitialSelectionType(editDeck: Deck, existingDeck?: Deck) {
    if (existingDeck && existingDeck.thronesDbId) {
      return DeckSelectionType.IMPORT;
    }
    if (editDeck && !editDeck.deckId) {
      return DeckSelectionType.NEW;
    }
    return DeckSelectionType.EXISTING;
  }

  constructor(private store: Store<fromRoot.State>,
              private deckService: DeckService,
              private notificationService: NotificationService) {
    this.editDeck$ = store.select(fromRoot.getDeckForEdit);
  }

  ngOnInit() {
    let deck: Deck;
    this.editDeck$.subscribe(x => deck = x);
    this.deckSelection = DeckSelectorComponent.getInitialSelectionType(deck, this.existingDeck);
  }

  onDeckSelectTypeChange(deckSelectionType: number) {
    this.deckSelection = deckSelectionType;
  }

  onExistingDeckUpdate(deck: Deck) {
    this.existingDeck = deck;
  }

  onExistingDeckSelect() {
    this.updateDeck.emit({ deck: this.existingDeck, version: this.deckVersion });
  }

  onImportedDeckSelect(deck: Deck) {
    this.deckService.getDeckBy({
      thronesDbId: deck.thronesDbId,
    }).take(1).subscribe(
      (existingDeck: Deck) => {
        if (existingDeck) {
          this.notificationService.warn('Already imported', 'Deck has already been imported, selecting existing');
          console.warn('Deck has already been imported', deck, existingDeck);
          this.existingDeck = existingDeck;
          this.onExistingDeckSelect();
        } else {
          this.selectNewDeck(deck);
        }
      });
  }

  onNewDeckChanges(deck: Deck) {
    this.store.dispatch(new deckActions.UpdateAction(deck));
  }

  onNewDeckSelect() {
    let deck: Deck;
    this.editDeck$.subscribe(x => deck = x);
    this.selectNewDeck(deck);
  }

  private selectNewDeck(deck: Deck) {
    this.existingDeck = null;

    // TODO relocate to store?
    const updatedDeck = Deck.patchValues(deck, {
      creatorId: this.playerId,
    });

    this.updateDeck.emit({ deck: updatedDeck, version: this.deckVersion });
  }
}

enum DeckSelectionType {
  NEW, IMPORT, EXISTING
}
