import { Params } from '@angular/router';
import { cloneDeep, pick } from 'lodash';
import { DateRangeType } from './date-range-type.model';

export class FilterCriteria {
  fromDate: string; //iso
  toDate: string; //iso
  ascending: boolean = true;
  rangeSelection: DateRangeType = DateRangeType.CURRENT_SEASON;
  playerIds: string[] = [];
  factionIds: number[] = [];
  agendaIds: number[] = [];
  deckIds: number[] = [];
  playerGroupIds: number[] = [];
  [key: string]: string | boolean | string[] | number[] | DateRangeType;

  static patchValues(source: FilterCriteria, changes: any) {
    const updatedCriteria: FilterCriteria = Object.assign({}, source, changes);

    return ['factionIds', 'agendaIds', 'deckIds', 'playerGroupIds']
      .reduce((memo, numericKey) => {
        memo[numericKey] = memo[numericKey] && +memo[numericKey];
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

    const arrayParamKeys = [
      'playerIds',
      'factionIds',
      'agendaIds',
      'deckIds',
      'playerGroupIds',
    ];
    return arrayParamKeys.reduce((memo: any, key: string) => {
      if (routeParams[key]) {
        memo[key] = extractNumberArray(routeParams[key]);
      }
      return memo;
    }, criteria);

    function extractNumberArray(param: string): number[] {
      return param ? param.split(',').map((id) => +id) : [];
    }
  }
}
