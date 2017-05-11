import { Action } from '@ngrx/store';
import { Player } from '../../shared/models/player.model';

export const LOAD = '[CurrentPlayer] Load';
export const   LOAD_COMPLETE = '[CurrentPlayer] Load Complete';

export class LoadAction implements Action {
  readonly type = LOAD;
}

export class LoadCompleteAction implements Action {
  readonly type = LOAD_COMPLETE;

  constructor(public payload: Player) {
  }
}

export type Actions
  = LoadAction
  | LoadCompleteAction;
