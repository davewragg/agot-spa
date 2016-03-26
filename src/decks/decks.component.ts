import {Component, Input} from 'angular2/core';
import {DeckService} from '../shared/services/deck.service';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {Deck} from '../shared/models/deck.model';
import {DecksTableComponent} from './decks-table.component';

@Component({
  selector: 'agot-decks',
  moduleId: module.id,
  viewProviders: [DeckService],
  templateUrl: './decks.component.html',
  directives: [DecksTableComponent, SpinnerComponent]
})
export class DecksComponent {
  @Input()
  title:string;

  decks:Deck[];
  loadingError:any = null;

  isLoading:boolean;

  constructor(private _deckService:DeckService) {
    this.loadDecks();
  }

  loadDecks() {
    this.isLoading = true;
    this._deckService.getDecks()
      .subscribe(
        (decks:Deck[]) => {
          this.loadingError = null;
          this.decks = decks;
        },
        (err) => {
          this.loadingError = err._body || err.message || err;
          this.isLoading = false;
        },
        () => {
          console.log('done');
          this.isLoading = false;
        }
      );
  }
}
