import { Action } from '@ngrx/store';
import { type } from '../util';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { Game } from '../../shared/models/game.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
  FILTER: type('[Game] Filter'),
  FILTER_COMPLETE: type('[Game] Filter Complete'),
  LOAD: type('[Game] Load'),
  SELECT: type('[Game] Select'),
  DELETE: type('[Game] Delete'),
  DELETE_COMPLETE: type('[Game] Delete Complete'),
  DELETE_FAILURE: type('[Game] Delete Failure'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handgame/advanced-types.html#discriminated-unions
 */
export class FilterAction implements Action {
  type = ActionTypes.FILTER;

  constructor(public payload: FilterCriteria) {
  }
}

export class FilterCompleteAction implements Action {
  type = ActionTypes.FILTER_COMPLETE;

  constructor(public payload: Game[]) {
  }
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: Game) {
  }
}

export class SelectAction implements Action {
  type = ActionTypes.SELECT;

  constructor(public payload: number) {
  }
}

export class DeleteAction implements Action {
  type = ActionTypes.DELETE;

  constructor(public payload: Game) {
  }
}

export class DeleteCompleteAction implements Action {
  type = ActionTypes.DELETE_COMPLETE;

  constructor(public payload: Game) {
  }
}

export class DeleteFailureAction implements Action {
  type = ActionTypes.DELETE_FAILURE;

  constructor(public payload: Error | any) {
  }
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
  | DeleteAction
  | DeleteCompleteAction
  | DeleteFailureAction;
