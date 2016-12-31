import { DateRangeType } from './date-range-type.model';
import { Params } from '@angular/router';
import * as _ from 'lodash';

export class FilterCriteria {
  fromDate: string; //iso
  toDate: string; //iso
  ascending: boolean = true;
  rangeSelection: DateRangeType = DateRangeType.CURRENT_SEASON;
  playerIds: number[] = [];
  factionIds: number[] = [];
  agendaIds: number[] = [];
  deckIds: number[] = [];

  static serialise(criteria: FilterCriteria): any {
    return _.cloneDeep(criteria);
  }

  static deserialise(routeParams: Params): FilterCriteria {
    const criteria = new FilterCriteria();
    // TODO come back and check this does what it's supposed to
    Object.assign(criteria, _.pick(routeParams, [
      'fromDate', 'toDate', 'ascending', 'rangeSelection'
    ]));
    // param strings
    criteria.rangeSelection = +criteria.rangeSelection;
    if (routeParams['playerIds']) {
      criteria.playerIds = Array.from(routeParams['playerIds']).map((id) => +id);
    }
    if (routeParams['factionIds']) {
      criteria.factionIds = Array.from(routeParams['factionIds']).map((id) => +id);
    }
    if (routeParams['agendaIds']) {
      criteria.agendaIds = Array.from(routeParams['agendaIds']).map((id) => +id);
    }
    if (routeParams['deckIds']) {
      criteria.deckIds = Array.from(routeParams['deckIds']).map((id) => +id);
    }
    return criteria;
  }
}
