import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { SetOfResults } from '../shared/models/set-of-results.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerGroupActions from '../state-management/actions/player-group.actions';

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

  selectedGroupId$: Observable<number>;
  criteria$: Observable<FilterCriteria>;
  rankings$: Observable<SetOfResults>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.criteria$ = store.select(fromRoot.getRankingsCriteria);
    this.rankings$ = store.select(fromRoot.getFilteredRankings);
    this.loading$ = store.select(fromRoot.getRankingsLoading);
  }

  onSelectedGroupChange(criteria: FilterCriteria) {
    const [playerGroupId] = criteria.playerGroupIds;
    this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));
    this.loadRankings(criteria);
  }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadRankings(criteria);
  }

  loadRankings(criteria?: FilterCriteria) {
    let playerGroupId: number;
    this.selectedGroupId$.subscribe(x => playerGroupId = x);
    const patchedCriteria = FilterCriteria.patchValues(criteria, {
      playerGroups: [playerGroupId],
    });
    this.store.dispatch(go(['/rankings', FilterCriteria.serialise(patchedCriteria)]));
  }
}
