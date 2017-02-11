import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { SetOfResults } from '../shared/models/set-of-results.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-rankings',
  templateUrl: 'rankings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingsComponent {
  @Input()
  title: string;
  @Input()
  hideFilters: boolean = false;
  @Input()
  criteria: FilterCriteria; // TODO remove/refactor

  criteria$: Observable<FilterCriteria>;
  rankings$: Observable<SetOfResults>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.criteria$ = store.select(fromRoot.getRankingsCriteria).take(1);
    this.rankings$ = store.select(fromRoot.getFilteredRankings);
    this.loading$ = store.select(fromRoot.getRankingsLoading);
  }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadRankings(criteria);
  }

  loadRankings(criteria?: FilterCriteria) {
    this.store.dispatch(go(['/rankings', FilterCriteria.serialise(criteria)]));
  }
}
