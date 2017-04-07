import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { cloneDeep } from 'lodash';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Season } from '../models/season.model';
import { DateRangeType } from '../models/date-range-type.model';
import * as fromRoot from '../../state-management/reducers/root';
import { Store } from '@ngrx/store';

@Component({
  moduleId: module.id,
  selector: 'agot-date-range',
  templateUrl: 'date-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent implements OnChanges {
  @Input()
  criteria: FilterCriteria;
  @Input()
  showSort: boolean = true;
  @Output()
  rangeChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  rangeSelection: DateRangeType;
  dateRangeType = DateRangeType;
  seasons$: Observable<Season[]>;

  today: string;
  aWeekAgo: string;
  selectedSeason: string;

  private static setDates(criteria: FilterCriteria, fromDate?: string, toDate?: string) {
    return Object.assign({}, criteria, {
      fromDate,
      toDate,
    });
  };

  constructor(private store: Store<fromRoot.State>) {
    this.seasons$ = this.store.select(fromRoot.getSeasons);
    const now = new Date();
    this.today = endOfDay(now).toISOString();
    this.aWeekAgo = startOfDay(subDays(now, 7)).toISOString();
  }

  ngOnChanges() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.criteria = cloneDeep(this.criteria);
    }
    this.rangeSelection = this.criteria.rangeSelection;
    this.setSelectedSeason(this.criteria);
  }

  onSortChange(ascending: boolean) {
    const criteria = Object.assign({}, this.criteria, {
      ascending,
    });
    this.onExecute(criteria);
  }

  onSetSeason(season: Season) {
    const criteria = FilterCriteria.patchValues(this.criteria, {
      rangeSelection: DateRangeType.CUSTOM,
    });
    this.onExecute(DateRangeComponent.setDates(criteria, season.startDate, season.endDate));
  }

  onSetRange(range: DateRangeType) {
    const criteria = FilterCriteria.patchValues(this.criteria, {
      rangeSelection: range,
    });
    this.onExecute(DateRangeComponent.setDates(criteria, null, null));
  }

  onExecute(criteria: FilterCriteria) {
    this.setSelectedSeason(criteria);
    this.rangeChange.emit(criteria);
  }

  private setSelectedSeason(criteria: FilterCriteria) {
    this.selectedSeason = `${criteria.fromDate}:${criteria.toDate}`;
  }
}
