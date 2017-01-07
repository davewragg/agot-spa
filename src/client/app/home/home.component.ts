import { Component } from '@angular/core';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { DateRangeType } from '../shared/models/date-range-type.model';

@Component({
  moduleId: module.id,
  selector: 'agot-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  gameFilterCriteria: FilterCriteria;
  rankingFilterCriteria: FilterCriteria;

  constructor() {
    this.rankingFilterCriteria = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.ALL_TIME
    });
    this.gameFilterCriteria = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.THIS_WEEK
    });
  }
}
