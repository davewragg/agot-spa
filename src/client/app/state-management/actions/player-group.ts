import { Action } from '@ngrx/store';
import { type } from '../util';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { PlayerGroup } from '../../shared/models/player-group.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
  FILTER: type('[PlayerGroup] Filter'),
  FILTER_COMPLETE: type('[PlayerGroup] Filter Complete'),
  LOAD: type('[PlayerGroup] Load'),
  SELECT: type('[PlayerGroup] Select'),
  GET_SELECTED: type('[PlayerGroup] Get Selected'),
  APPLY_SELECTED: type('[PlayerGroup] Apply Selected'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handplayerGroup/advanced-types.html#discriminated-unions
 */
export class FilterAction implements Action {
  type = ActionTypes.FILTER;

  constructor(public payload: FilterCriteria) {
  }
}

export class FilterCompleteAction implements Action {
  type = ActionTypes.FILTER_COMPLETE;

  constructor(public payload: PlayerGroup[]) {
  }
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: PlayerGroup) {
  }
}

export class SelectAction implements Action {
  type = ActionTypes.SELECT;

  constructor(public payload: number) {
  }
}

export class GetSelectedAction implements Action {
  type = ActionTypes.GET_SELECTED;
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = FilterAction
  | FilterCompleteAction
  | LoadAction
  | SelectAction
  | GetSelectedAction;
