import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { Deck } from '../shared/models/deck.model';
import * as fromRoot from '../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-decks',
  templateUrl: 'decks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecksComponent {
  @Input()
  title: string;
  @Input()
  hideFilters: boolean = false;
  @Input()
  criteria: FilterCriteria; // TODO remove/refactor

  criteria$: Observable<FilterCriteria>;
  decks$: Observable<Deck[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.criteria$ = store.select(fromRoot.getDecksCriteria).take(1);
    this.decks$ = store.select(fromRoot.getFilteredDecks);
    this.loading$ = store.select(fromRoot.getDecksLoading);
  }

  onFilterChange(criteria: FilterCriteria) {
    this.loadDecks(criteria);
  }

  loadDecks(criteria?: FilterCriteria) {
    this.store.dispatch(go(['/decks', FilterCriteria.serialise(criteria)]));
  }
}
