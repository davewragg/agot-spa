import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../state-management/reducers/root';
import { PlayerGroup } from '../shared/models/player-group.model';

@Component({
  selector: 'agot-selected-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-1">
      <h2>Group Details</h2>

      <agot-group-edit-form
        (cancel)="onCancel()"
        (updatePlayerGroup)="saveGroup($event)"
        [playerGroup]="playerGroup$ | async"></agot-group-edit-form>

      <ul class="list-group">
        <li class="list-group-item" *ngFor="let player of (playerGroup$ | async).players">
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

  constructor(private store: Store<fromRoot.State>) {
    this.playerGroup$ = store.select(fromRoot.getViewingPlayerGroup);
  }

  onCancel() {
    // go to groups
  }

  saveGroup(changes: any) {
    console.log(changes);
    // save and go to groups
  }
}
