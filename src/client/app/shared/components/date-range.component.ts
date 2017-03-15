import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { cloneDeep } from 'lodash';
import { SeasonService } from '../services/season.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Season } from '../models/season.model';
import { DateRangeType } from '../models/date-range-type.model';

@Component({
  moduleId: module.id,
  selector: 'agot-date-range',
  templateUrl: 'date-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent implements OnInit {
  @Input()
  criteria: FilterCriteria;
  @Input()
  showSort: boolean = true;
  @Output()
  rangeChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  dateRangeType = DateRangeType;
  seasons: Observable<Season[]>;

  today: string;
  aWeekAgo: string;
  selectedSeason: string;

  private static setDates(criteria: FilterCriteria, fromDate?: string, toDate?: string) {
    return Object.assign({}, criteria, {
      fromDate,
      toDate,
    });
  };

  constructor(private _seasonService: SeasonService) {
    this.seasons = _seasonService.seasons;
    const now = new Date();
    this.today = endOfDay(now).toISOString();
    this.aWeekAgo = startOfDay(subDays(now, 7)).toISOString();
  }

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.criteria = cloneDeep(this.criteria);
    }
    this.setSelectedSeason(this.criteria);
  }

  onSortChange(ascending: boolean) {
    // this.criteria.ascending = ascending;
    const criteria = Object.assign({}, this.criteria, {
      ascending,
    });
    this.onExecute(criteria);
  }

  onSetSeason(season: Season) {
    // this.criteria.rangeSelection = DateRangeType.CUSTOM;
    const criteria = Object.assign({}, this.criteria, {
      rangeSelection: DateRangeType.CUSTOM,
    });
    this.onExecute(DateRangeComponent.setDates(criteria, season.startDate, season.endDate));
  }

  onSetRange(range: DateRangeType) {
    // this.criteria.rangeSelection = range;
    const criteria = Object.assign({}, this.criteria, {
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
