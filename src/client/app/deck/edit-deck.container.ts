import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../state-management/reducers/root';
import * as deck from '../state-management/actions/deck.actions';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Deck Page's responsibility is to map router params
 * to a 'Select' deck action. Actually showing the selected
 * deck remains a responsibility of the
 * SelectedDeckPageComponent
 */
@Component({
  selector: 'agot-edit-deck-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-deck-details></agot-deck-details>
  `
})
export class EditDeckPageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .select<number>('id')
      .map(id => new deck.SelectForEditAction(id))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
