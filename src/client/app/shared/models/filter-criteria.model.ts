import {DateRangeType} from './date-range-type.model';
import {Params} from '@angular/router';
import * as _ from 'lodash';

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
    return _.cloneDeep(criteria);
  }

  static deserialise(routeParams:Params):FilterCriteria {
    const criteria = new FilterCriteria();
    // TODO find out what's happened to RouteParams
    // Object.assign(criteria, _.pick(routeParams.params, [
    //   'fromDate', 'toDate', 'ascending', 'rangeSelection'
    // ]));
    // // param strings
    // criteria.rangeSelection = +criteria.rangeSelection;
    // if (routeParams.get('playerIds')) {
    //   criteria.playerIds = Array.from(routeParams.get('playerIds')).map((id) => +id);
    // }
    // if (routeParams.get('factionIds')) {
    //   criteria.factionIds = Array.from(routeParams.get('factionIds')).map((id) => +id);
    // }
    // if (routeParams.get('agendaIds')) {
    //   criteria.agendaIds = Array.from(routeParams.get('agendaIds')).map((id) => +id);
    // }
    // if (routeParams.get('deckIds')) {
    //   criteria.deckIds = Array.from(routeParams.get('deckIds')).map((id) => +id);
    // }
    return criteria;
  }
}
