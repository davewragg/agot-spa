import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../state-management/reducers/root';
import * as rankingActions from '../state-management/actions/rankings.actions';
import * as gameActions from '../state-management/actions/game.actions';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { DateRangeType } from '../shared/models/date-range-type.model';

@Component({
  moduleId: module.id,
  selector: 'agot-home',
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  selectedGroupId$: Observable<number>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
  }

  ngOnInit() {
    this.selectedGroupId$.filter((x) => !!x).take(1).toPromise().then((groupId) => {
      this.initRankings(groupId);
      this.initGames(groupId);
    });
  }

  private initGames(groupId: number) {
    const gameFilterCriteria = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.THIS_WEEK,
      playerGroupIds: [groupId],
    });
    this.store.dispatch(new gameActions.SetFilterAction(gameFilterCriteria));
  }

  private initRankings(groupId: number) {
    const rankingFilterCriteria = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.ALL_TIME,
      playerGroupIds: [groupId],
    });
    this.store.dispatch(new rankingActions.SetFilterAction(rankingFilterCriteria));
  }
}
