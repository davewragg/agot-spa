import { Component, Input, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { DeckService } from '../shared/services/deck.service';
import { Deck } from '../shared/models/deck.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
// import { SpinnerComponent } from '../shared/components/spinner.component';
// import { DecksTableComponent } from './decks-table.component';
// import { PlayerFilterComponent } from '../shared/components/player-filter.component';
// import { FactionFilterComponent } from '../shared/components/faction-filter.component';
// import { AgendaFilterComponent } from '../shared/components/agenda-filter.component';

@Component({
  moduleId: module.id,
  selector: 'agot-decks',
  templateUrl: 'decks.component.html',
  // directives: [
  //   ROUTER_DIRECTIVES,
  //   DecksTableComponent,
  //   SpinnerComponent,
  //   PlayerFilterComponent,
  //   FactionFilterComponent,
  //   AgendaFilterComponent,
  // ]
})
export class DecksComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  initialFiltering: FilterCriteria;

  decks: Deck[];
  loadingError: any = null;

  isLoading: boolean;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _deckService: DeckService) {

  }

  ngOnInit() {
    // this.setInitialFiltering(params);
    // this.loadDecks(this.initialFiltering);
    this._route.params
      .map(this.setInitialFiltering.bind(this))
      .do(() => this.isLoading = true)
      .switchMap((criteria: FilterCriteria) => this._deckService.getDecks(criteria))
      .subscribe(
        (decks: Deck[]) => {
          this.loadingError = null;
          this.decks = decks;
          // TODO until loading states are sorted out
          this.isLoading = false;
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


  onFilterChange(criteria: FilterCriteria) {
    this.loadDecks(criteria);
    // this._router.navigate(['/decks', FilterCriteria.serialise(criteria)]);
  }

  loadDecks(criteria?: FilterCriteria) {
    this._router.navigate(['/decks', FilterCriteria.serialise(criteria)]);
  }

  private setInitialFiltering(params: Params) {
    const defaultFilter = this.initialFiltering || {};
    return isEmpty(params) ?
      defaultFilter :
      Object.assign(defaultFilter, FilterCriteria.deserialise(params));
  }
}
