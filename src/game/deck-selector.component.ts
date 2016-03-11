import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Deck} from '../shared/models/deck.model';
import {DeckService} from '../shared/services/deck.service';
import {ExistingDeckSelectorComponent} from './existing-deck-selector.component';

@Component({
  selector: 'agot-deck-selector',
  moduleId: module.id,
  templateUrl: './deck-selector.component.html',
  directives:[ExistingDeckSelectorComponent]
})
export class DeckSelectorComponent {
  @Input()
  playerId:number;
  @Output()
  updateDeck:EventEmitter<Deck> = new EventEmitter<Deck>();

  useNewDeck:boolean = false;

  constructor(private deckService:DeckService) {
  }

  onDeckSelectChange(useNewDeck:boolean) {
    console.log(useNewDeck);
    this.useNewDeck = useNewDeck;
  }

  onDeckSelect(deck:Deck) {
    console.log(deck);
    this.updateDeck.emit(deck);
  }
}
