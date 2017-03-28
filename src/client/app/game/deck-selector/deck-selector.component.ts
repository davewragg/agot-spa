import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Deck } from '../../shared/models/deck.model';
import { DeckService } from '../../shared/services/deck.service';
import { NotificationService } from '../../shared/services/notification.service';

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

  deckSelection: DeckSelectionType;
  deckSelectionType = DeckSelectionType;

  editDeck: Deck;

  constructor(private deckService: DeckService, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.setInitialSelectionType();
    // can't edit imported decks
    this.editDeck = (this.existingDeck && this.existingDeck.thronesDbId) ? new Deck() : this.existingDeck;
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
    this.deckService.getDeckBy('thronesDbId', deck.thronesDbId).subscribe(
      (existingDeck: Deck) => {
        if (existingDeck) {
          this.notificationService.warn('Already imported', 'Deck has already been imported, selecting existing');
          console.warn('Deck has already been imported', deck, existingDeck);
          this.existingDeck = existingDeck;
          this.onExistingDeckSelect();
        } else {
          this.onNewDeckSelect(deck);
        }
      });
  }

  onNewDeckSelect(deck: Deck) {
    this.existingDeck = null;
    // TODO relocate somewhere more appropriate?
    deck.creatorId = this.playerId;
    this.updateDeck.emit({ deck: deck, version: this.deckVersion });
  }

  private setInitialSelectionType() {
    if (this.existingDeck) {
      if (this.existingDeck.thronesDbId) {
        this.deckSelection = DeckSelectionType.IMPORT;
      } else if (!this.existingDeck.deckId) {
        this.deckSelection = DeckSelectionType.NEW;
      }
    }
    this.deckSelection = this.deckSelection || DeckSelectionType.EXISTING;
  }
}

enum DeckSelectionType {
  NEW, IMPORT, EXISTING
}
