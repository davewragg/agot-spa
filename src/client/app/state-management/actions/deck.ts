import { Action } from '@ngrx/store';
import { type } from '../util';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { Deck } from '../../shared/models/deck.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
  FILTER: type('[Deck] Filter'),
  FILTER_COMPLETE: type('[Deck] Filter Complete'),
  LOAD: type('[Deck] Load'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handdeck/advanced-types.html#discriminated-unions
 */
export class FilterAction implements Action {
  type = ActionTypes.FILTER;

  constructor(public payload: FilterCriteria) {
  }
}

export class FilterCompleteAction implements Action {
  type = ActionTypes.FILTER_COMPLETE;

  constructor(public payload: Deck[]) {
  }
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: Deck) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = FilterAction
  | FilterCompleteAction
  | LoadAction;
