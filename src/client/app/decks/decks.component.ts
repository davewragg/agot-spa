import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteParams, Router } from '@angular/router';
import { DeckService } from '../shared/services/deck.service';
import { SpinnerComponent } from '../shared/components/spinner.component';
import { Deck } from '../shared/models/deck.model';
import { DecksTableComponent } from './decks-table.component';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { PlayerFilterComponent } from '../shared/components/player-filter.component';
import { FactionFilterComponent } from '../shared/components/faction-filter.component';
import { AgendaFilterComponent } from '../shared/components/agenda-filter.component';

@Component({
  selector: 'agot-decks',
  templateUrl: 'decks/decks.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    DecksTableComponent,
    SpinnerComponent,
    PlayerFilterComponent,
    FactionFilterComponent,
    AgendaFilterComponent,
  ]
})
export class DecksComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  initialFiltering: FilterCriteria;

  decks: Deck[];
  loadingError: any = null;

  isLoading: boolean;

  constructor(params: RouteParams,
              private _router: Router,
              private _deckService: DeckService) {
    this.setInitialFiltering(params);
  }

  ngOnInit() {
    this.loadDecks(this.initialFiltering);
  }


  onFilterChange(criteria: FilterCriteria) {
    // this.loadDecks(criteria);
    this._router.navigate(['Decks', FilterCriteria.serialise(criteria)]);
  }

  loadDecks(criteria?: FilterCriteria) {
    this.isLoading = true;
    this._deckService.getDecks(criteria)
      .subscribe(
        (decks: Deck[]) => {
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

  private setInitialFiltering(params: RouteParams) {
    this.initialFiltering = Object.assign(this.initialFiltering || {}, FilterCriteria.deserialise(params));
  }
}
