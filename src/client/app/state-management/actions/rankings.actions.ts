import { Action } from '@ngrx/store';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { SetOfResults } from '../../shared/models/set-of-results.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SET_FILTER = '[Rankings] Set Filter';
export const FILTER = '[Rankings] Filter';
export const FILTER_COMPLETE = '[Rankings] Filter Complete';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handrankings/advanced-types.html#discriminated-unions
 */
export class SetFilterAction implements Action {
  readonly type = SET_FILTER;

  constructor(public payload: FilterCriteria) {
  }
}

export class FilterAction implements Action {
  readonly type = FILTER;

  constructor(public payload: FilterCriteria) {
  }
}

export class FilterCompleteAction implements Action {
  readonly type = FILTER_COMPLETE;

  constructor(public payload: SetOfResults) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SetFilterAction
  | FilterAction
  | FilterCompleteAction;
