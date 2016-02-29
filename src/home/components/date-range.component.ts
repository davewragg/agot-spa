import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {SeasonService} from '../../shared/services/season.service';
import {FilterCriteria} from '../../shared/models/filter-criteria.model';
import {Season} from '../../shared/models/season.model';
import {DateRangeType} from '../../shared/models/date-range-type.model';
import * as moment from 'moment/moment';

@Component({
  selector: 'agot-date-range',
  moduleId: module.id,
  templateUrl: './date-range.html',
  viewProviders: [SeasonService],
})
export class DateRangeComponent {
  @Input()
  criteria:FilterCriteria;
  @Input()
  rangeSelection:any = DateRangeType.ALL_TIME;
  @Input()
  showSort:boolean = true;
  @Output()
  rangeChange:EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  dateRangeType = DateRangeType;
  seasons:Season[];

  today:string;
  aWeekAgo:string;

  // TODO extract to utils
  private static convertDateString(dateString?:string) {
    // have to remove the time and timezone to populate the control correctly
    return dateString && dateString.slice(0, 10);
  };

  constructor(private _seasonService:SeasonService) {
    _seasonService.getAllSeasons().subscribe((seasons:Season[]) => {
      this.seasons = seasons.reverse();
    });
    this.today = moment().add(1, 'days').toISOString();
    this.aWeekAgo = moment().subtract(7, 'days').toISOString();
    if (!this.criteria) {
      this.criteria = <FilterCriteria>{
        ascending: false,
      };
      this.setRangeDates(this.rangeSelection);
    }
  }

  onSortChange(ascending:boolean) {
    this.criteria.ascending = ascending;
    this.onExecute();
  }

  onSetSeason(season:Season) {
    this.rangeSelection = season.name;
    this.setDates(season.startDate, season.endDate);
    this.onExecute();
  }

  onSetRange(range:any) {
    console.log(range);
    this.rangeSelection = range;
    this.setRangeDates(range);

    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    this.rangeChange.emit(this.criteria);
  }

  private setRangeDates(range) {
    if (range === DateRangeType.THIS_WEEK) {
      this.setAWeekAgo();
    } else if (range === DateRangeType.ALL_TIME) {
      this.setAllTime();
    }
  };

  private setAWeekAgo() {
    this.setDates(this.aWeekAgo, this.today);
  };

  private setAllTime() {
    this.setDates(null, null);
  };

  private setDates(fromDate?:string, toDate?:string) {
    Object.assign(this.criteria, {
      fromDate: DateRangeComponent.convertDateString(fromDate),
      toDate: DateRangeComponent.convertDateString(toDate),
    });
  };
}
