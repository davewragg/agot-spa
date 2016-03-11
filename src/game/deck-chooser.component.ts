import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Deck} from '../shared/models/deck.model';
import {SpinnerComponent} from '../shared/components/spinner.component';

@Component({
  selector: 'agot-deck-chooser',
  moduleId: module.id,
  template: `
    <agot-spinner [isRunning]="isLoading"></agot-spinner>
    <select class="form-control icon-menu" [disabled]="isLoading"
      (change)="onDeckChange(deckSelect.value)" #deckSelect>
      <option value="">--Choose deck--</option>
      <option *ngFor="#deck of decks; #i = index"
       [style.backgroundImage]="deck.factionId && ('url(/assets/img/agenda' + deck.factionId + '.png)')"
      value="{{ i }}">{{ deck.getTitle() }}</option>
    </select>
  `,
  directives: [<any>SpinnerComponent],
  styles: [
    `select.icon-menu option {
      background-repeat:no-repeat;
      background-position:bottom left;
      padding-left:30px;
    }`
  ]
})
export class DeckChooserComponent {
  @Input()
  isLoading:boolean;
  @Input()
  decks:Deck[];
  @Output()
  selectDeck:EventEmitter<Deck> = new EventEmitter<Deck>();


  onDeckChange(deckIndex:string) {
    if (!deckIndex) {
      return;
    }
    const deck = this.decks[+deckIndex];
    this.selectDeck.emit(deck);
  }
}
