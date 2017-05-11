import { Action } from '@ngrx/store';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { Player } from '../../shared/models/player.model';
import { PlayerStats } from '../../shared/models/player-stats.model';

  export const GET_FOR_GROUP_COMPLETE = '[Player] Get for Player Group Complete';
  export const LOAD = '[Player] Load';
  export const SET_SELECT = '[Player] Set Select';
  export const SELECT = '[Player] Select';
  export const SELECT_COMPLETE = '[Player] Select Complete';

export class GetForGroupCompleteAction implements Action {
  readonly type = GET_FOR_GROUP_COMPLETE;

  constructor(public payload: Player[]) {
  }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: Player) {
  }
}

export class SetSelectAction implements Action {
  readonly type = SET_SELECT;

  constructor(public payload: { playerId: string, criteria: FilterCriteria }) {
  }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: { playerId: string, criteria: FilterCriteria }) {
  }
}

export class SelectCompleteAction implements Action {
  readonly type = SELECT_COMPLETE;

  constructor(public payload: PlayerStats) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = GetForGroupCompleteAction
  | LoadAction
  | SetSelectAction
  | SelectAction
  | SelectCompleteAction;
