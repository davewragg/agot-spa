import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { isEmpty } from 'lodash';
import * as fromRoot from '../state-management/reducers/index';
import * as rankingActions from '../state-management/actions/rankings';
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
  selector: 'agot-rankings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-all-rankings></agot-all-rankings>
  `
})
export class RankingsContainerComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .map(params => isEmpty(params) ? new FilterCriteria() : FilterCriteria.deserialise(params))
      .map(criteria => new rankingActions.FilterAction(criteria))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
