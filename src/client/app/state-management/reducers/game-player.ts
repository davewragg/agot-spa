import { GamePlayer } from '../../shared/models/game-player.model';
import * as gamePlayerActions from '../actions/game-player.actions';

export interface State {
  dirty: boolean;
  playerToEdit: GamePlayer;
}

const initialState: State = {
  dirty: false,
  playerToEdit: null,
};

export function reducer(state = initialState, action: gamePlayerActions.Actions): State {
  switch (action.type) {
    case gamePlayerActions.ActionTypes.UPDATE_COMPLETE: {
      const changes = action.payload;
      return Object.assign({}, state, {
        playerToEdit: GamePlayer.patchValues(state.playerToEdit, changes),
        dirty: true,
      });
    }

    default: {
      return state;
    }
  }
}

export const getGamePlayerForEdit = (state: State) => state.playerToEdit;

export const getGamePlayerForEditDirty = (state: State) => state.dirty;
