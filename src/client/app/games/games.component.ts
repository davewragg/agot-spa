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

  onSelectedGroupChange(playerGroupId: number) {
    this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));

    this.loadGames({ playerGroupIds: [playerGroupId] });
  }

  onDateRangeChange(partialCriteria: FilterCriteria) {
    this.loadGames(partialCriteria);
  }

  onShowMore(newLimit: number) {
    this.loadGames({
      limit: newLimit,
    });
  }

  loadGames(changedCriteria: object = {}) {
    const patchedCriteria = this.processUpdatedCriteria(changedCriteria);
    this.store.dispatch(go(['/games', FilterCriteria.serialise(patchedCriteria)]));
  }

  private processUpdatedCriteria(changedCriteria: object) {
    const existingCriteria = this.getExistingCriteria();
    const newCriteria = this.setCurrentPlayerGroup(existingCriteria, changedCriteria);
    return FilterCriteria.patchValues(existingCriteria, newCriteria);
  }

  private getExistingCriteria() {
    let existingCriteria: FilterCriteria;
    this.searchQuery$.subscribe(x => existingCriteria = x);
    return existingCriteria;
  }

  private setCurrentPlayerGroup(existingCriteria: FilterCriteria, changedCriteria: object) {
    if (existingCriteria.playerGroupIds.length) {
      return changedCriteria;
    }
    let selectedGroupId = this.getSelectedPlayerGroupId();
    return Object.assign({
      playerGroupIds: [selectedGroupId],
    }, changedCriteria);
  }

  private getSelectedPlayerGroupId() {
    let selectedGroupId;
    this.selectedGroupId$.subscribe(x => selectedGroupId = x);
    return selectedGroupId;
  }
}
