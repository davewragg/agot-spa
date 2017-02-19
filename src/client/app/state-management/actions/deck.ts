import { Action } from '@ngrx/store';
import { type } from '../util';
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
export const ActionTypes = {
  FILTER: type('[Deck] Filter'),
  FILTER_COMPLETE: type('[Deck] Filter Complete'),
  LOAD: type('[Deck] Load'),
  SELECT_FOR_EDIT: type('[Deck] Select for Edit'),
  UPDATE: type('[Deck] Update'),
  SAVE_UPDATED: type('[Deck] Save updated'),
  SAVE_UPDATED_COMPLETE: type('[Deck] Save complete'),
  SAVE_UPDATED_FAILURE: type('[Deck] Save failure'),
  SELECT: type('[Deck] Select'),
  SELECT_COMPLETE: type('[Deck] Select Complete'),
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

export class SelectForEditAction implements Action {
  type = ActionTypes.SELECT_FOR_EDIT;

  constructor(public payload: number) {
  }
}

export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;

  constructor(public payload: Deck) {
  }
}

export class SaveUpdateAction implements Action {
  type = ActionTypes.SAVE_UPDATED;

  constructor(public payload: Deck) {
  }
}

export class SaveUpdateCompleteAction implements Action {
  type = ActionTypes.SAVE_UPDATED_COMPLETE;

  constructor(public payload: Deck) {
  }
}

export class SaveUpdateFailureAction implements Action {
  type = ActionTypes.SAVE_UPDATED_FAILURE;

  constructor(public payload: Error | any) {
  }
}

export class SelectAction implements Action {
  type = ActionTypes.SELECT;

  constructor(public payload: number) {
  }
}

export class SelectCompleteAction implements Action {
  type = ActionTypes.SELECT_COMPLETE;

  constructor(public payload: DeckStats) {
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
  | SelectForEditAction
  | UpdateAction
  | SaveUpdateAction
  | SaveUpdateCompleteAction
  | SaveUpdateFailureAction
  | SelectAction
  | SelectCompleteAction;
