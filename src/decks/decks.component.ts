import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {DeckService} from '../shared/services/deck.service';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {Deck} from '../shared/models/deck.model';
import {DecksTableComponent} from './decks-table.component';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {PlayerFilterComponent} from '../shared/components/player-filter.component';

@Component({
  selector: 'agot-decks',
  moduleId: module.id,
  templateUrl: './decks.component.html',
  directives: [ROUTER_DIRECTIVES, DecksTableComponent, SpinnerComponent, PlayerFilterComponent]
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

  onPlayerFilterChange(criteria:FilterCriteria) {
    console.log(criteria);
    this.loadDecks(criteria);
  }

  loadDecks(criteria?:FilterCriteria) {
    this.isLoading = true;
    this._deckService.getDecks(criteria)
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
