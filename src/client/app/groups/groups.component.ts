import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PlayerGroup } from '../shared/models/player-group.model';
import * as fromRoot from '../state-management/reducers/root';

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
}
