import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { isEmpty } from 'lodash';
import * as fromRoot from '../state-management/reducers/root';
import * as groupActions from '../state-management/actions/player-group.actions';
import { FilterCriteria } from '../shared/models/filter-criteria.model';

@Component({
  selector: 'agot-groups-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-groups></agot-groups>
  `
})
export class GroupsContainerComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .map(params => isEmpty(params) ? new FilterCriteria() : FilterCriteria.deserialise(params))
      .map(criteria => new groupActions.FilterAction(criteria))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
