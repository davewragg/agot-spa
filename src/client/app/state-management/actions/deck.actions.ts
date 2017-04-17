import { Action } from '@ngrx/store';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { Deck } from '../../shared/models/deck.model';
import { DeckStats } from '../../shared/models/deck-stats.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SET_FILTER = '[Deck] Set Filter';
export const FILTER = '[Deck] Filter';
export const FILTER_COMPLETE = '[Deck] Filter Complete';
export const LOAD = '[Deck] Load';
export const SELECT_FOR_EDIT = '[Deck] Select for Edit';
export const UPDATE = '[Deck] Update';
export const UPDATE_COMPLETE = '[Deck] Update Complete';
export const SAVE_UPDATED = '[Deck] Save updated';
export const SAVE_UPDATED_COMPLETE = '[Deck] Save complete';
export const SAVE_UPDATED_FAILURE = '[Deck] Save failure';
export const SELECT = '[Deck] Select';
export const SELECT_COMPLETE = '[Deck] Select Complete';
export const LOAD_FOR_GROUP = '[Deck] Load for Group';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handdeck/advanced-types.html#discriminated-unions
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

  constructor(public payload: Deck[]) {
  }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: Deck) {
  }
}

export class SelectForEditAction implements Action {
  readonly type = SELECT_FOR_EDIT;

  constructor(public payload: number) {
  }
}

export class UpdateAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: Deck) {
  }
}

export class UpdateCompleteAction implements Action {
  readonly type = UPDATE_COMPLETE;

  constructor(public payload: Deck) {
  }
}

export class SaveUpdateAction implements Action {
  readonly type = SAVE_UPDATED;

  constructor(public payload: Deck) {
  }
}

export class SaveUpdateCompleteAction implements Action {
  readonly type = SAVE_UPDATED_COMPLETE;

  constructor(public payload: Deck) {
  }
}

export class SaveUpdateFailureAction implements Action {
  readonly type = SAVE_UPDATED_FAILURE;

  constructor(public payload: Error | any) {
  }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export class SelectCompleteAction implements Action {
  readonly type = SELECT_COMPLETE;

  constructor(public payload: DeckStats) {
  }
}

export class LoadForGroupAction implements Action {
  readonly type = LOAD_FOR_GROUP;

  constructor(public payload: Deck[]) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SetFilterAction
  | FilterAction
  | FilterCompleteAction
  | LoadAction
  | SelectForEditAction
  | UpdateAction
  | UpdateCompleteAction
  | SaveUpdateAction
  | SaveUpdateCompleteAction
  | SaveUpdateFailureAction
  | SelectAction
  | SelectCompleteAction
  | LoadForGroupAction;
