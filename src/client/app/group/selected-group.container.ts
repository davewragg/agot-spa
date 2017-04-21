import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { PlayerGroup } from '../shared/models/player-group.model';
import * as playerGroupActions from '../state-management/actions/player-group.actions';
import * as fromRoot from '../state-management/reducers/root';

@Component({
  selector: 'agot-selected-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-1">
      <h2>Group Details</h2>

      <agot-group-edit-form
        *ngIf="!(loading$ | async)"
        (cancel)="onCancel()"
        (updatePlayerGroup)="saveGroup($event)"
        [playerGroup]="playerGroup$ | async"></agot-group-edit-form>

      <ul class="list-group">
        <li class="list-group-item" *ngFor="let player of (playerGroup$ | async)?.players">
          <agot-player-link [player]="player"></agot-player-link>
          <span class="pull-right">
            <!--TODO is admin-->
            <span class="tag tag-success">Admin</span>
            <!--TODO kick-->
            <span class="tag tag-danger">Eject</span>
          </span>
        </li>
      </ul>
    </div>
  `,
})
export class SelectedPlayerGroupPageComponent {
  playerGroup$: Observable<PlayerGroup>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.playerGroup$ = store.select(fromRoot.getViewingPlayerGroup);
    this.loading$ = store.select(fromRoot.getPlayerGroupsLoading);
  }

  onCancel() {
    this.store.dispatch(go(['groups']));
  }

  saveGroup(changes: any) {
    console.log(changes);
    this.store.dispatch(new playerGroupActions.SaveAction(changes));
  }
}
