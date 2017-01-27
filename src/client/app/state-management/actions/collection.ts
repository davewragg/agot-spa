import { Action } from '@ngrx/store';
import { type } from '../util';
import { Game } from '../../shared/models/game.model';

export const ActionTypes = {
  ADD_GAME: type('[Collection] Add Game'),
  ADD_GAME_SUCCESS: type('[Collection] Add Game Success'),
  ADD_GAME_FAIL: type('[Collection] Add Game Fail'),
  REMOVE_GAME: type('[Collection] Remove Game'),
  REMOVE_GAME_SUCCESS: type('[Collection] Remove Game Success'),
  REMOVE_GAME_FAIL: type('[Collection] Remove Game Fail'),
  LOAD: type('[Collection] Load'),
  LOAD_SUCCESS: type('[Collection] Load Success'),
  LOAD_FAIL: type('[Collection] Load Fail'),
};

/**
 * Add Game to Collection Actions
 */
export class AddGameAction implements Action {
  type = ActionTypes.ADD_GAME;

  constructor(public payload: Game) {
  }
}

export class AddGameSuccessAction implements Action {
  type = ActionTypes.ADD_GAME_SUCCESS;

  constructor(public payload: Game) {
  }
}

export class AddGameFailAction implements Action {
  type = ActionTypes.ADD_GAME_FAIL;

  constructor(public payload: Game) {
  }
}


/**
 * Remove Game from Collection Actions
 */
export class RemoveGameAction implements Action {
  type = ActionTypes.REMOVE_GAME;

  constructor(public payload: Game) {
  }
}

export class RemoveGameSuccessAction implements Action {
  type = ActionTypes.REMOVE_GAME_SUCCESS;

  constructor(public payload: Game) {
  }
}

export class RemoveGameFailAction implements Action {
  type = ActionTypes.REMOVE_GAME_FAIL;

  constructor(public payload: Game) {
  }
}

/**
 * Load Collection Actions
 */
export class LoadAction implements Action {
  type = ActionTypes.LOAD;
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Game[]) {
  }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: any) {
  }
}


export type Actions
  = AddGameAction
  | AddGameSuccessAction
  | AddGameFailAction
  | RemoveGameAction
  | RemoveGameSuccessAction
  | RemoveGameFailAction
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction;
