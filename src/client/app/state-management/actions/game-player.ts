import { Action } from '@ngrx/store';
import { type } from '../util';
import { GamePlayer } from '../../shared/models/game-player.model';
import { Player } from '../../shared/models/player.model';
import { Deck } from '../../shared/models/deck.model';

export const ActionTypes = {
  UPDATE: type('[GamePlayer] Update'),
  UPDATE_COMPLETE: type('[GamePlayer] Update Complete'),
  SET_PLAYER: type('[GamePlayer] Set Player'),
  SET_DECK: type('[GamePlayer] Set Deck'),
  CLEAR: type('[GamePlayer] Clear'),
};

export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;

  constructor(public payload: GamePlayer) {
  }
}

export class UpdateCompleteAction implements Action {
  type = ActionTypes.UPDATE_COMPLETE;

  constructor(public payload: GamePlayer) {
  }
}

export class SetPlayerAction implements Action {
  type = ActionTypes.SET_PLAYER;

  constructor(public payload: Player) {
  }
}

export class SetDeckAction implements Action {
  type = ActionTypes.SET_DECK;

  constructor(public payload: {deck: Deck, version: number}) {
  }
}

export class ClearAction implements Action {
  type = ActionTypes.CLEAR;
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = UpdateAction
  | UpdateCompleteAction
  | SetPlayerAction
  | SetDeckAction
  | ClearAction;
