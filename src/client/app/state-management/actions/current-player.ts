import { Action } from '@ngrx/store';
import { type } from '../util';
import { Player } from '../../shared/models/player.model';

export const ActionTypes = {
  LOAD: type('[CurrentPlayer] Load'),
  LOAD_COMPLETE: type('[CurrentPlayer] Load Complete'),
};

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
}

export class LoadCompleteAction implements Action {
  type = ActionTypes.LOAD_COMPLETE;

  constructor(public payload: Player) {
  }
}

export type Actions
  = LoadAction
  | LoadCompleteAction;
