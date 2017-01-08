import { Params } from '@angular/router';
import { cloneDeep, pick } from 'lodash';
import { DateRangeType } from './date-range-type.model';

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
    return cloneDeep(criteria);
  }

  static deserialise(routeParams: Params): FilterCriteria {
    const criteria = new FilterCriteria();
    Object.assign(criteria, pick(routeParams, [
      'fromDate', 'toDate',
    ]));
    // params are strings
    if (routeParams['rangeSelection']) {
      criteria.rangeSelection = +routeParams['rangeSelection'];
    }
    criteria.ascending = routeParams['ascending'] === 'true';

    const arrayParamKeys = [
      'playerIds',
      'factionIds',
      'agendaIds',
      'deckIds',
    ];
    return arrayParamKeys.reduce((memo: any, key: string) => {
      memo[key] = extractNumberArray(routeParams[key]);
      return memo;
    }, criteria);

    function extractNumberArray(param: string): number[] {
      return param ? param.split(',').map((id) => +id) : [];
    }
  }
}
