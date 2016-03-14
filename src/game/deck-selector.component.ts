import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {Deck} from '../shared/models/deck.model';
import {DeckService} from '../shared/services/deck.service';
import {ExistingDeckSelectorComponent} from './existing-deck-selector.component';
import {DeckEditFormComponent} from '../decks/deck-edit-form.component';
import {DeckImportFormComponent} from '../decks/deck-import-form.component';
import {NotificationService} from '../shared/services/notification.service';

@Component({
  selector: 'agot-deck-selector',
  moduleId: module.id,
  templateUrl: './deck-selector.component.html',
  directives: [ExistingDeckSelectorComponent, DeckEditFormComponent, DeckImportFormComponent]
})
export class DeckSelectorComponent implements OnInit {
  @Input()
  creating:boolean;
  @Input()
  playerId:number;
  @Input()
  existingDeck:Deck;
  @Output()
  updateDeck:EventEmitter<Deck> = new EventEmitter<Deck>();

  deckSelection:DeckSelectionType;
  deckSelectionType = DeckSelectionType;

  constructor(private deckService:DeckService, private notificationService:NotificationService) {
  }

  ngOnInit() {
    this.deckSelection = this.existingDeck && !this.existingDeck.deckId ?
      DeckSelectionType.NEW : DeckSelectionType.EXISTING;
  }

  onDeckSelectTypeChange(deckSelectionType:number) {
    this.deckSelection = deckSelectionType;
  }

  onExistingDeckUpdate(deck:Deck) {
    this.existingDeck = deck;
  }

  onExistingDeckSelect() {
    this.updateDeck.emit(this.existingDeck);
  }

  onImportedDeckSelect(deck:Deck) {
    this.deckService.getDeckBy('thronesDbId', deck.thronesDbId).subscribe(
      (existingDeck:Deck) => {
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

  onNewDeckSelect(deck:Deck) {
    this.existingDeck = null;
    // TODO relocate somewhere more appropriate?
    deck.creatorId = this.playerId;
    this.updateDeck.emit(deck);
  }
}

enum DeckSelectionType {
  NEW, IMPORT, EXISTING
}
