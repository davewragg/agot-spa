import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {SeasonService} from '../../shared/services/season.service';
import {FilterCriteria} from '../../shared/models/filter-criteria.model';
import {Season} from '../../shared/models/season.model';
import {DateRangeType} from '../../shared/models/date-range-type.model';
import * as moment from 'moment/moment';

@Component({
  selector: 'agot-date-range',
  templateUrl: 'home/components/date-range.html',
})
export class DateRangeComponent implements OnInit {
  @Input()
  criteria:FilterCriteria;
  @Input()
  showSort:boolean = true;
  @Output()
  rangeChange:EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  dateRangeType = DateRangeType;
  seasons:Observable<Season[]>;

  today:string;
  aWeekAgo:string;

  // TODO extract to utils
  private static convertDateString(dateString?:string) {
    // have to remove the time and timezone to populate the control correctly
    return dateString && dateString.slice(0, 10);
  }

  constructor(private _seasonService:SeasonService) {
    this.seasons = _seasonService.seasons;
    this.today = moment().add(1, 'days').toISOString();
    this.aWeekAgo = moment().subtract(7, 'days').toISOString();
  }

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = Object.assign(new FilterCriteria(), {
        ascending: false,
        rangeSelection: DateRangeType.ALL_TIME
      });
    }
  }

  onSortChange(ascending:boolean) {
    this.criteria.ascending = ascending;
    this.onExecute();
  }

  onSetSeason(season:Season) {
    this.criteria.rangeSelection = DateRangeType.CUSTOM;
    this.setDates(season.startDate, season.endDate);
    this.onExecute();
  }

  onSetRange(range:DateRangeType) {
    this.criteria.rangeSelection = range;
    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    this.rangeChange.emit(this.criteria);
  }

  private setDates(fromDate?:string, toDate?:string) {
    Object.assign(this.criteria, {
      fromDate: DateRangeComponent.convertDateString(fromDate),
      toDate: DateRangeComponent.convertDateString(toDate),
    });
  };
}
