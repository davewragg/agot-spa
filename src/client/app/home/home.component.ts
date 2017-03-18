import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../state-management/reducers/root';
import * as rankingActions from '../state-management/actions/rankings';
import * as gameActions from '../state-management/actions/game';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { DateRangeType } from '../shared/models/date-range-type.model';

@Component({
  moduleId: module.id,
  selector: 'agot-home',
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    const rankingFilterCriteria = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.ALL_TIME
    });
    const gameFilterCriteria = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.THIS_WEEK
    });
    this.store.dispatch(new rankingActions.FilterAction(rankingFilterCriteria));
    this.store.dispatch(new gameActions.FilterAction(gameFilterCriteria));
  }
}
