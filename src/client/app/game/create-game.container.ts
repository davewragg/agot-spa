import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../state-management/reducers/root';
import * as game from '../state-management/actions/game.actions';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Game Page's responsibility is to map router params
 * to a 'Select' game action. Actually showing the selected
 * game remains a responsibility of the
 * SelectedGamePageComponent
 */
@Component({
  selector: 'agot-create-game-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-game-details></agot-game-details>
  `
})
export class CreateGamePageComponent implements OnInit {
  constructor(private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.store.dispatch(new game.CreateNewAction());
  }
}
