import { Action } from '@ngrx/store';
import { type } from '../util';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { Player } from '../../shared/models/player.model';
import { PlayerStats } from '../../shared/models/player-stats.model';

export const ActionTypes = {
  GET_FOR_GROUP_COMPLETE: type('[Player] Get for Player Group Complete'),
  LOAD: type('[Player] Load'),
  SET_SELECT: type('[Player] Set Select'),
  SELECT: type('[Player] Select'),
  SELECT_COMPLETE: type('[Player] Select Complete'),
};

export class GetForGroupCompleteAction implements Action {
  type = ActionTypes.GET_FOR_GROUP_COMPLETE;

  constructor(public payload: Player[]) {
  }
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: Player) {
  }
}

export class SetSelectAction implements Action {
  type = ActionTypes.SET_SELECT;

  constructor(public payload: { playerId: string, criteria: FilterCriteria }) {
  }
}

export class SelectAction implements Action {
  type = ActionTypes.SELECT;

  constructor(public payload: { playerId: string, criteria: FilterCriteria }) {
  }
}

export class SelectCompleteAction implements Action {
  type = ActionTypes.SELECT_COMPLETE;

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
