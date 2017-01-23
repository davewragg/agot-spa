import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SeasonService } from '../services/season.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Season } from '../models/season.model';
import { DateRangeType } from '../models/date-range-type.model';
import * as moment from 'moment/moment';

@Component({
  moduleId: module.id,
  selector: 'agot-date-range',
  templateUrl: 'date-range.component.html',
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

  constructor(private _seasonService: SeasonService) {
    this.seasons = _seasonService.seasons;
    this.today = moment().add(1, 'days').toISOString();
    this.aWeekAgo = moment().subtract(7, 'days').toISOString();
  }

  // TODO refactor this to be immutable - return a new object on every event

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.criteria = Object.assign({}, this.criteria);
    }
    this.setSelectedSeason();
  }

  onSortChange(ascending: boolean) {
    this.criteria.ascending = ascending;
    this.onExecute();
  }

  onSetSeason(season: Season) {
    this.criteria.rangeSelection = DateRangeType.CUSTOM;
    this.setDates(season.startDate, season.endDate);
    this.onExecute();
  }

  onSetRange(range: DateRangeType) {
    this.criteria.rangeSelection = range;
    this.setDates(null, null);
    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    // this.setSelectedSeason();
    this.rangeChange.emit(this.criteria);
  }

  private setDates(fromDate?: string, toDate?: string) {
    Object.assign(this.criteria, {
      fromDate,
      toDate,
    });
  };

  private setSelectedSeason() {
    this.selectedSeason = `${this.criteria.fromDate}:${this.criteria.toDate}`;
  }
}
