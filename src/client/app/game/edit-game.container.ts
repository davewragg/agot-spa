import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../state-management/reducers/root';
import * as game from '../state-management/actions/game';

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
  selector: 'agot-edit-game-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-game-details></agot-game-details>
  `
})
export class EditGamePageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .select<number>('id')
      .map(id => new game.SelectForEditAction(id))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
