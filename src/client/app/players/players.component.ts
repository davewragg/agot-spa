import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Player } from '../shared/models/player.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerGroupActions from '../state-management/actions/player-group.actions';

@Component({
  moduleId: module.id,
  selector: 'agot-players',
  templateUrl: 'players.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent {
  selectedGroupId$: Observable<number>;
  players$: Observable<Player[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.players$ = store.select(fromRoot.getGroupPlayers);
    this.loading$ = store.select(fromRoot.getPlayersLoading);
  }

  onSelectedGroupChange(criteria: FilterCriteria) {
    const [playerGroupId] = criteria.playerGroupIds;
    console.log(playerGroupId);
    this.loadPlayers(playerGroupId);
  }

  loadPlayers(playerGroupId?: number) {
    this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));
  }
}
