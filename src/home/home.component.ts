import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {GamesComponent} from './components/games.component';
import {AllRankingsComponent} from './../rankings/all-rankings.component';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {DateRangeType} from '../shared/models/date-range-type.model';

@Component({
  selector: 'agot-home',
  templateUrl: './home/home.html',
  directives: [GamesComponent, AllRankingsComponent, ROUTER_DIRECTIVES]
})
export class HomeComponent {
  filterCriteria:FilterCriteria;

  constructor() {
    this.filterCriteria = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.THIS_WEEK
    });
  }
}
