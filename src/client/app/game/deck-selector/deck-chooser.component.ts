import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// TODO omfg forms
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Deck } from '../../shared/models/deck.model';
// import { SpinnerComponent } from '../shared/components/spinner.component';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-chooser',
  templateUrl: 'deck-chooser.component.html',
  // directives: [<any>SpinnerComponent],
  styles: [
    `select.icon-menu option {
      background-repeat:no-repeat;
      background-position:bottom left;
      padding-left:30px;
    }`
  ]
})
export class DeckChooserComponent implements OnInit {
  @Input()
  isLoading: boolean;
  @Input()
  existingDeck: Deck;
  @Input()
  decks: Deck[];
  @Output()
  selectDeck: EventEmitter<Deck> = new EventEmitter<Deck>();

  deckChooserForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.populateForm();
  }

  onDeckChange(deckId: string) {
    if (!deckId) {
      return;
    }
    const deck = this.decks.find((deck) => deck.deckId === +deckId);
    this.selectDeck.emit(deck);
  }

  private populateForm() {
    let deckId = (this.existingDeck && this.existingDeck.deckId) || '';
    this.deckChooserForm = this._formBuilder.group({
      deckId: [deckId, Validators.required],
    });
  };
}
