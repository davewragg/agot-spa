import * as currentPlayerActions from '../actions/current-player';
import { Player } from '../../shared/models/player.model';

export interface State {
  loading: boolean;
  currentPlayer: Player;
}

const initialState: State = {
  loading: false,
  currentPlayer: null,
};

export function reducer(state = initialState, action: currentPlayerActions.Actions): State {
  switch (action.type) {
    case currentPlayerActions.ActionTypes.LOAD: {
      return {
        loading: true,
        currentPlayer: state.currentPlayer,
      };
    }
    case currentPlayerActions.ActionTypes.LOAD_COMPLETE: {
      const player = action.payload;

      return {
        loading: false,
        currentPlayer: player,
      };
    }

    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;

export const getCurrentPlayer = (state: State) => state.currentPlayer;

