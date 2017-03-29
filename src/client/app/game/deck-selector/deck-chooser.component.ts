import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Deck } from '../../shared/models/deck.model';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-chooser',
  templateUrl: 'deck-chooser.component.html',
  styles: [
      `select.icon-menu option {
      background-repeat: no-repeat;
      background-position: bottom left;
      padding-left: 30px;
    }`
  ]
})
export class DeckChooserComponent {
  @Input()
  isLoading: boolean;
  @Input()
  decks: Deck[];
  @Output()
  selectDeck: EventEmitter<Deck> = new EventEmitter<Deck>();

  @Input()
  set existingDeck(deck: Deck) {
    if (deck) {
      this.deckChooserForm.patchValue(deck);
    } else {
      this.deckChooserForm.patchValue({ deckId: '' });
    }
  };

  deckChooserForm: FormGroup = new FormGroup({
    deckId: new FormControl(['', Validators.required]),
  });

  onDeckChange(deckId: string) {
    if (!deckId) {
      return;
    }
    const deck = this.decks.find((deck) => deck.deckId === +deckId);
    this.selectDeck.emit(deck);
  }
}
