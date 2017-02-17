import { Action } from '@ngrx/store';
import { type } from '../util';
import { Faction } from '../../shared/models/faction.model';
import { Agenda } from '../../shared/models/agenda.model';
import { Venue } from '../../shared/models/venue.model';
import { Season } from '../../shared/models/season.model';

export const ActionTypes = {
  LOAD: type('[RefData] Load'),
  LOAD_SUCCESS: type('[RefData] Load Success'),
  LOAD_FAIL: type('[RefData] Load Fail'),
};

/**
 * Load RefData Actions
 */
export class LoadAction implements Action {
  type = ActionTypes.LOAD;
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: [
    Faction[],
    Agenda[],
    Venue[],
    Season[]
    ]) {
  }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: any) {
  }
}


export type Actions
  = LoadAction
  | LoadSuccessAction
  | LoadFailAction;
