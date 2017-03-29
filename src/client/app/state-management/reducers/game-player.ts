import * as gamePlayerActions from '../actions/game-player';
import { GamePlayer } from '../../shared/models/game-player.model';
import { Player } from '../../shared/models/player.model';
import { Deck } from '../../shared/models/deck.model';

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

    case gamePlayerActions.ActionTypes.SET_PLAYER: {
      const player = action.payload;
      const changes = {
        player,
        playerId: player.playerId,
      };
      return Object.assign({}, state, {
        playerToEdit: GamePlayer.patchValues(state.playerToEdit, changes),
        dirty: true,
      });
    }

    case gamePlayerActions.ActionTypes.SET_DECK: {
      const { deck, version } = action.payload;
      const changes = {
        deck,
        deckId: deck.deckId,
        thronesDbVersion: version,
      };
      return Object.assign({}, state, {
        playerToEdit: GamePlayer.patchValues(state.playerToEdit, changes),
        dirty: true,
      });
    }

    case gamePlayerActions.ActionTypes.CLEAR: {
      const gamePlayer = new GamePlayer();
      gamePlayer.playerId = '';
      gamePlayer.player = <Player>{ playerId: gamePlayer.playerId };
      gamePlayer.deckId = -1;
      gamePlayer.deck = <Deck>{ deckId: gamePlayer.deckId };
      gamePlayer.thronesDbVersion = null;
      return {
        dirty: false,
        playerToEdit: gamePlayer,
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getGamePlayerForEdit = (state: State) => state.playerToEdit;

export const getGamePlayerForEditDirty = (state: State) => state.dirty;
