import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { isEmpty } from 'lodash';
import * as fromRoot from '../state-management/reducers/root';
import * as gameActions from '../state-management/actions/game';
import { FilterCriteria } from '../shared/models/filter-criteria.model';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Book Page's responsibility is to map router params
 * to a 'Select' book action. Actually showing the selected
 * book remains a responsibility of the
 * SelectedBookPageComponent
 */
@Component({
  selector: 'agot-games-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-games></agot-games>
  `
})
export class GamesContainerComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .map(params => isEmpty(params) ? new FilterCriteria() : FilterCriteria.deserialise(params))
      .map(criteria => new gameActions.FilterAction(criteria))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
