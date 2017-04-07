import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { go } from '@ngrx/router-store';
import { Game } from '../shared/models/game.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerGroupActions from '../state-management/actions/player-group';

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

  selectedGroupId$: Observable<number>;
  searchQuery$: Observable<FilterCriteria>;
  games$: Observable<Game[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.searchQuery$ = store.select(fromRoot.getSearchQuery).take(1);
    this.games$ = store.select(fromRoot.getSearchResults);
    this.loading$ = store.select(fromRoot.getSearchLoading);
  }

  onSelectedGroupChange(criteria: FilterCriteria) {
    const [playerGroupId] = criteria.playerGroupIds;
    this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));
    this.loadGames(criteria);
  }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadGames(criteria);
  }

  loadGames(criteria?: FilterCriteria) {
    let playerGroupId: number;
    this.selectedGroupId$.subscribe(x => x = playerGroupId);
    const patchedCriteria = FilterCriteria.patchValues(criteria, {
      playerGroups: [playerGroupId],
    });
    this.store.dispatch(go(['/games', FilterCriteria.serialise(patchedCriteria)]));
  }
}
