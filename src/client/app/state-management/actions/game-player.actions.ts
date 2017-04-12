import { Action } from '@ngrx/store';
import { type } from '../util';
import { GamePlayer } from '../../shared/models/game-player.model';

export const ActionTypes = {
  UPDATE: type('[GamePlayer] Update'),
  UPDATE_COMPLETE: type('[GamePlayer] Update Complete'),
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

export type Actions
  = UpdateAction
  | UpdateCompleteAction;
