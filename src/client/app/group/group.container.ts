import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../state-management/reducers/root';
import * as playerGroup from '../state-management/actions/player-group.actions';

@Component({
  selector: 'agot-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agot-selected-group-page></agot-selected-group-page>
  `
})
export class PlayerGroupPageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .select<number>('id')
      .map(id => new playerGroup.SetForEditAction(id))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
