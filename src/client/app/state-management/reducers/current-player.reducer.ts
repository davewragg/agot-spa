import { Player } from '../../shared/models/player.model';
import * as currentPlayerActions from '../actions/current-player.actions';
import * as playerGroupActions from '../actions/player-group.actions';

export interface State {
  loading: boolean;
  currentPlayer: Player;
  groupIds: Array<number>;
}

const initialState: State = {
  loading: false,
  currentPlayer: null,
  groupIds: [],
};

export function reducer(state = initialState, action: currentPlayerActions.Actions | playerGroupActions.Actions): State {
  switch (action.type) {
    case currentPlayerActions.LOAD: {
      return Object.assign({}, state, {
        loading: true,
      });
    }
    case currentPlayerActions.LOAD_COMPLETE: {
      const player = action.payload;
      const ids = player.playerGroups.map(x => x.id);

      return Object.assign({}, state, {
        loading: false,
        currentPlayer: player,
        groupIds: ids,
      });
    }

    case playerGroupActions.SAVE_COMPLETE: {
      const group = action.payload;
      const updatedGroupIds = state.groupIds.includes(group.id) ? state.groupIds : [
        ...state.groupIds,
        group.id,
      ];
      return Object.assign({}, state, {
        loading: false,
        groupIds: updatedGroupIds,
      });
    }

    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;

export const getCurrentPlayer = (state: State) => state.currentPlayer;
export const getCurrentPlayerGroupIds = (state: State) => state.groupIds;

