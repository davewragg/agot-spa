import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { go } from '@ngrx/router-store';
import { Game } from '../shared/models/game.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerGroupActions from '../state-management/actions/player-group.actions';

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
  hideFilters: boolean = false;

  selectedGroupId$: Observable<number>;
  searchQuery$: Observable<FilterCriteria>;
  games$: Observable<Game[]>;
  loading$: Observable<boolean>;
  totalRecords$: Observable<number>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.searchQuery$ = store.select(fromRoot.getSearchQuery);
    this.games$ = store.select(fromRoot.getSearchResults);
    this.loading$ = store.select(fromRoot.getSearchLoading);
    this.totalRecords$ = store.select(fromRoot.getSearchTotalRecords);
  }

  onSelectedGroupChange(partialCriteria: FilterCriteria) {
    const [playerGroupId] = partialCriteria.playerGroupIds;
    this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));

    this.loadGames(partialCriteria);
  }

  onDateRangeChange(partialCriteria: FilterCriteria) {
    this.loadGames(partialCriteria);
  }

  onShowMore(newLimit: number) {
    this.loadGames(<FilterCriteria>{
      limit: newLimit,
    });
  }

  loadGames(changedCriteria?: FilterCriteria) {
    let existingCriteria: FilterCriteria;
    this.searchQuery$.subscribe(x => existingCriteria = x);
    const patchedCriteria = FilterCriteria.patchValues(existingCriteria, changedCriteria);
    this.store.dispatch(go(['/games', FilterCriteria.serialise(patchedCriteria)]));
  }
}
