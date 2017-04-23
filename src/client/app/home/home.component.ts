import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { DateRangeType } from '../shared/models/date-range-type.model';
import * as rankingActions from '../state-management/actions/rankings.actions';
import * as gameActions from '../state-management/actions/game.actions';
import * as playerGroupActions from '../state-management/actions/player-group.actions';
import * as fromRoot from '../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-home',
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  groupSub: Subscription;
  selectedGroupId$: Observable<number>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
  }

  ngOnInit() {
    this.groupSub = this.selectedGroupId$.filter((x) => !!x).subscribe((groupId) => {
      this.initRankings(groupId);
      this.initGames(groupId);
    });
  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
  }

  onGroupChange(groupId: number) {
    this.store.dispatch(new playerGroupActions.SelectAction(groupId));
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
