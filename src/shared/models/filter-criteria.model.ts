import {DateRangeType} from './date-range-type.model';
import {RouteParams} from 'angular2/router';

export class FilterCriteria {
  fromDate:string; //iso
  toDate:string; //iso
  ascending:boolean = true;
  rangeSelection:DateRangeType = DateRangeType.ALL_TIME;
  playerIds:number[] = [];
  factionIds:number[] = [];
  agendaIds:number[] = [];
  deckIds:number[] = [];

  static serialise(criteria:FilterCriteria):any {
    return Object.assign({}, criteria);
  }

  static deserialise(routeParams:RouteParams):FilterCriteria {
    const criteria = new FilterCriteria();
    Object.assign(criteria, routeParams.params);
    // param strings
    criteria.rangeSelection = +criteria.rangeSelection;
    return criteria;
  }
}
