import { Action } from '@ngrx/store';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { PlayerGroup } from '../../shared/models/player-group.model';
import { Player } from '../../shared/models/player.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const FILTER = '[PlayerGroup] Filter';
export const FILTER_COMPLETE = '[PlayerGroup] Filter Complete';
export const LOAD = '[PlayerGroup] Load';
export const SELECT = '[PlayerGroup] Select';
export const SET_FOR_EDIT = '[PlayerGroup] Set for Edit';
export const GET_SELECTED = '[PlayerGroup] Get Selected';
export const SAVE = '[PlayerGroup] Save';
export const SAVE_COMPLETE = '[PlayerGroup] Save Complete';
export const SAVE_FAILURE = '[PlayerGroup] Save Failure';
export const JOIN = '[PlayerGroup] Join';
export const JOIN_COMPLETE = '[PlayerGroup] Join Complete';
export const JOIN_FAILURE = '[PlayerGroup] Join Failure';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handplayerGroup/advanced-types.html#discriminated-unions
 */
export class FilterAction implements Action {
  readonly type = FILTER;

  constructor(public payload: FilterCriteria) {
  }
}

export class FilterCompleteAction implements Action {
  readonly type = FILTER_COMPLETE;

  constructor(public payload: PlayerGroup[]) {
  }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: PlayerGroup) {
  }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export class SetForEditAction implements Action {
  readonly type = SET_FOR_EDIT;

  constructor(public payload: number) {
  }
}

export class GetSelectedAction implements Action {
  readonly type = GET_SELECTED;
}

export class SaveAction implements Action {
  readonly type = SAVE;

  constructor(public payload: PlayerGroup) {
  }
}

export class SaveCompleteAction implements Action {
  readonly type = SAVE_COMPLETE;

  constructor(public payload: PlayerGroup) {
  }
}

export class SaveFailureAction implements Action {
  readonly type = SAVE_FAILURE;

  constructor(public payload: any) {
  }
}

export class JoinAction implements Action {
  readonly type = JOIN;

  constructor(public payload: PlayerGroup) {
  }
}

export class JoinCompleteAction implements Action {
  readonly type = JOIN_COMPLETE;

  constructor(public payload: PlayerGroup) {
  }
}

export class JoinFailureAction implements Action {
  readonly type = JOIN_FAILURE;

  constructor(public payload: any) {
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
  | SetForEditAction
  | GetSelectedAction
  | SaveAction
  | SaveCompleteAction
  | SaveFailureAction
  | JoinAction
  | JoinCompleteAction
  | JoinFailureAction;
