import { Params } from '@angular/router';
import { cloneDeep, merge, pick } from 'lodash';
import { DateRangeType } from './date-range-type.model';

export class FilterCriteria {
  private static NUMBER_ARRAY_PARAM_KEYS = ['factionIds', 'agendaIds', 'deckIds', 'playerGroupIds'];
  private static ARRAY_PARAM_KEYS = ['playerIds', ...FilterCriteria.NUMBER_ARRAY_PARAM_KEYS];
  private static DEFAULT_PAGE_SIZE = 30;

  fromDate: string; //iso
  toDate: string; //iso
  ascending: boolean = true;
  rangeSelection: DateRangeType = DateRangeType.CURRENT_SEASON;
  playerIds: string[] = [];
  factionIds: number[] = [];
  agendaIds: number[] = [];
  deckIds: number[] = [];
  playerGroupIds: number[] = [];
  limit: number = FilterCriteria.DEFAULT_PAGE_SIZE;
  offset: number = 0;
  [key: string]: string | boolean | string[] | number[] | DateRangeType;

  static patchValues(source: FilterCriteria = new FilterCriteria(), changes: any) {
    const updatedCriteria: FilterCriteria = merge({}, source, changes);

    return FilterCriteria.NUMBER_ARRAY_PARAM_KEYS
      .reduce((memo, numericKey) => {
        const numericArrayProperty = <Array<number>>memo[numericKey];
        if (numericArrayProperty && numericArrayProperty.length) {
          memo[numericKey] = numericArrayProperty.map(x => +x);
        }
        return memo;
      }, updatedCriteria);
  }

  static serialise(criteria: FilterCriteria): any {
    return cloneDeep(criteria);
  }

  static deserialise(routeParams: Params, sourceCriteria?: FilterCriteria): FilterCriteria {
    const criteria = cloneDeep(sourceCriteria) || new FilterCriteria();
    Object.assign(criteria, pick(routeParams, [
      'fromDate', 'toDate',
    ]));
    // params are strings
    if (routeParams['rangeSelection']) {
      criteria.rangeSelection = +routeParams['rangeSelection'];
    }
    if (routeParams['ascending']) {
      criteria.ascending = routeParams['ascending'] === 'true';
    }

    return FilterCriteria.ARRAY_PARAM_KEYS.reduce((memo: any, key: string) => {
      if (routeParams[key]) {
        memo[key] = extractArray(routeParams[key]);
      }
      return memo;
    }, criteria);

    function extractArray(param: string): (number|string)[] {
      return param ? param.split(',').map((id) =>
        FilterCriteria.NUMBER_ARRAY_PARAM_KEYS.includes(param) ? +id : id) : [];
    }
  }
}
