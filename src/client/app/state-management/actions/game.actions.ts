import { Action } from '@ngrx/store';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { Game } from '../../shared/models/game.model';
import { GamePlayer } from '../../shared/models/game-player.model';
import { Player } from '../../shared/models/player.model';
import { PaginatedResponse } from '../../shared/services/data.service';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SET_FILTER = '[Game] Set Filter';
export const FILTER = '[Game] Filter';
export const FILTER_COMPLETE = '[Game] Filter Complete';
export const LOAD = '[Game] Load';
export const SELECT = '[Game] Select';
export const SELECT_FOR_EDIT = '[Game] Select for Edit';
export const CREATE_NEW = '[Game] Create New';
export const UPDATE = '[Game] Update';
export const UPDATE_COMPLETE = '[Game] Update Complete';
export const ADD_PLAYER = '[Game] Add GamePlayer';
export const EDIT_PLAYER = '[Game] Edit GamePlayer';
export const CANCEL_EDIT_PLAYER = '[Game] Cancel Edit GamePlayer';
export const UPDATE_PLAYER = '[Game] Update GamePlayer';
export const REMOVE_PLAYER = '[Game] Remove GamePlayer';
export const SET_WINNER = '[Game] Set Winner';
export const SAVE_UPDATED = '[Game] Save updated';
export const SAVE_UPDATED_COMPLETE = '[Game] Save complete';
export const SAVE_UPDATED_FAILURE = '[Game] Save failure';
export const DELETE = '[Game] Delete';
export const DELETE_COMPLETE = '[Game] Delete Complete';
export const DELETE_FAILURE = '[Game] Delete Failure';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handgame/advanced-types.html#discriminated-unions
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

  constructor(public payload: PaginatedResponse) {
  }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: Game) {
  }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export class SelectForEditAction implements Action {
  readonly type = SELECT_FOR_EDIT;

  constructor(public payload: number) {
  }
}

export class CreateNewAction implements Action {
  readonly type = CREATE_NEW;
}

export class UpdateAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: Game) {
  }
}

export class UpdateCompleteAction implements Action {
  readonly type = UPDATE_COMPLETE;

  constructor(public payload: Game) {
  }
}

export class AddPlayerAction implements Action {
  readonly type = ADD_PLAYER;

  constructor(public payload: Player) {
  }
}

export class EditPlayerAction implements Action {
  readonly type = EDIT_PLAYER;
  // find by playerId
  constructor(public payload: GamePlayer) {
  }
}

export class CancelEditPlayerAction implements Action {
  readonly type = CANCEL_EDIT_PLAYER;
}

export class UpdatePlayerAction implements Action {
  readonly type = UPDATE_PLAYER;
  // find by playerId
  constructor(public payload: GamePlayer) {
  }
}

export class RemovePlayerAction implements Action {
  readonly type = REMOVE_PLAYER;

  constructor(public payload: GamePlayer) {
  }
}

export class SetWinnerAction implements Action {
  readonly type = SET_WINNER;

  constructor(public payload: GamePlayer) {
  }
}

export class SaveUpdateAction implements Action {
  readonly type = SAVE_UPDATED;

  constructor(public payload: Game) {
  }
}

export class SaveUpdateCompleteAction implements Action {
  readonly type = SAVE_UPDATED_COMPLETE;

  constructor(public payload: Game) {
  }
}

export class SaveUpdateFailureAction implements Action {
  readonly type = SAVE_UPDATED_FAILURE;

  constructor(public payload: Error | any) {
  }
}

export class DeleteAction implements Action {
  readonly type = DELETE;

  constructor(public payload: Game) {
  }
}

export class DeleteCompleteAction implements Action {
  readonly type = DELETE_COMPLETE;

  constructor(public payload: Game) {
  }
}

export class DeleteFailureAction implements Action {
  readonly type = DELETE_FAILURE;

  constructor(public payload: Error | any) {
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
  | SelectAction
  | SelectForEditAction
  | CreateNewAction
  | UpdateAction
  | UpdateCompleteAction
  | AddPlayerAction
  | EditPlayerAction
  | UpdatePlayerAction
  | CancelEditPlayerAction
  | RemovePlayerAction
  | SetWinnerAction
  | SaveUpdateAction
  | SaveUpdateCompleteAction
  | SaveUpdateFailureAction
  | DeleteAction
  | DeleteCompleteAction
  | DeleteFailureAction;
