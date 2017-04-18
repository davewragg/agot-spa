import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
// import { go } from '@ngrx/router-store';
import { PlayerGroup } from '../shared/models/player-group.model';
// import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';
// import * as playerGroupActions from '../state-management/actions/player-group.actions';

@Component({
  moduleId: module.id,
  selector: 'agot-groups',
  templateUrl: 'groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent {
  selectedGroupId$: Observable<number>;
  myGroups$: Observable<PlayerGroup[]>;
  groups$: Observable<PlayerGroup[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.myGroups$ = store.select(fromRoot.getMyPlayerGroups);
    this.groups$ = store.select(fromRoot.getAllButMyPlayerGroups);
    this.loading$ = store.select(fromRoot.getPlayerGroupsLoading);
  }
  //
  // onSelectedGroupChange(partialCriteria: FilterCriteria) {
  //   const [playerGroupId] = partialCriteria.playerGroupIds;
  //   this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));
  //
  //   this.loadGroups(partialCriteria);
  // }
  //
  // onDateRangeChange(partialCriteria: FilterCriteria) {
  //   this.loadGroups(partialCriteria);
  // }
  //
  // loadGroups(changedCriteria?: FilterCriteria) {
  //   let existingCriteria: FilterCriteria;
  //   this.searchQuery$.subscribe(x => existingCriteria = x);
  //   const patchedCriteria = FilterCriteria.patchValues(existingCriteria, changedCriteria);
  //   this.store.dispatch(go(['/groups', FilterCriteria.serialise(patchedCriteria)]));
  // }
}
