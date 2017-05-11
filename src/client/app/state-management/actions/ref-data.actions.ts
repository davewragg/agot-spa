import { Action } from '@ngrx/store';
import { Faction } from '../../shared/models/faction.model';
import { Agenda } from '../../shared/models/agenda.model';
import { Venue } from '../../shared/models/venue.model';
import { Season } from '../../shared/models/season.model';

export const LOAD = '[RefData] Load';
export const LOAD_SUCCESS = '[RefData] Load Success';
export const LOAD_FAIL = '[RefData] Load Fail';

/**
 * Load RefData Actions
 */
export class LoadAction implements Action {
  readonly type = LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: [
                Faction[],
                Agenda[],
                Venue[],
                Season[]
                ]) {
  }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) {
  }
}


export type Actions
  = LoadAction
  | LoadSuccessAction
  | LoadFailAction;
