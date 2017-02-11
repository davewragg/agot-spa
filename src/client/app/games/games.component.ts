import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { go } from '@ngrx/router-store';
import { Game } from '../shared/models/game.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-games',
  templateUrl: 'games.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent {
  @Input()
  title: string;
  @Input()
  criteria: FilterCriteria; // TODO remove/refactor
  @Input()
  hideFilters: boolean = false;

  searchQuery$: Observable<FilterCriteria>;
  games$: Observable<Game[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.searchQuery$ = store.select(fromRoot.getSearchQuery).take(1);
    this.games$ = store.select(fromRoot.getSearchResults);
    this.loading$ = store.select(fromRoot.getSearchLoading);
  }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadGames(criteria);
  }

  loadGames(criteria?: FilterCriteria) {
    this.store.dispatch(go(['/games', FilterCriteria.serialise(criteria)]));
  }
}
