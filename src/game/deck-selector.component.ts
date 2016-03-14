import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
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
export class DeckSelectorComponent implements OnInit {
  @Input()
  playerId:number;
  @Input()
  existingDeck:Deck;
  @Output()
  updateDeck:EventEmitter<Deck> = new EventEmitter<Deck>();

  deckSelection:DeckSelectionType;
  deckSelectionType = DeckSelectionType;

  constructor(private deckService:DeckService) {
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
