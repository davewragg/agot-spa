import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Deck} from '../shared/models/deck.model';
import {DeckService} from '../shared/services/deck.service';
import {ExistingDeckSelectorComponent} from './existing-deck-selector.component';
import {DeckEditFormComponent} from '../decks/deck-edit-form.component';

@Component({
  selector: 'agot-deck-selector',
  moduleId: module.id,
  templateUrl: './deck-selector.component.html',
  directives: [ExistingDeckSelectorComponent, DeckEditFormComponent]
})
export class DeckSelectorComponent {
  @Input()
  playerId:number;
  @Output()
  updateDeck:EventEmitter<Deck> = new EventEmitter<Deck>();

  existingDeck:Deck = new Deck();

  deckSelection:DeckSelectionType = DeckSelectionType.EXISTING;
  deckSelectionType = DeckSelectionType;

  constructor(private deckService:DeckService) {
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

  onNewDeckSelect(deck:Deck) {
    this.existingDeck = null;
    this.updateDeck.emit(deck);
  }
}

enum DeckSelectionType {
  NEW, IMPORT, EXISTING
}
