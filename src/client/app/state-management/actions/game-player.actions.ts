import { Action } from '@ngrx/store';
import { GamePlayer } from '../../shared/models/game-player.model';

export const UPDATE = '[GamePlayer] Update';
export const UPDATE_COMPLETE = '[GamePlayer] Update Complete';

export class UpdateAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: GamePlayer) {
  }
}

export class UpdateCompleteAction implements Action {
  readonly type = UPDATE_COMPLETE;

  constructor(public payload: GamePlayer) {
  }
}

export type Actions
  = UpdateAction
  | UpdateCompleteAction;
