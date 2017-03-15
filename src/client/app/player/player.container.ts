import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../state-management/reducers/root';
import * as player from '../state-management/actions/player';
import { FilterCriteria } from '../shared/models/filter-criteria.model';

@Component({
  selector: 'agot-view-player-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-player-details></agot-player-details>
  `
})
export class ViewPlayerPageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .map(params => {
        const id = params['id'];
        const criteria = FilterCriteria.deserialise(params);
        return { playerId: id, criteria };
      })
      .map(payload => new player.SelectAction(payload))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
