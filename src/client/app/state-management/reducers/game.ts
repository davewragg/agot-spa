import { cloneDeep } from 'lodash';
import * as gameActions from '../actions/game';
import { Game } from '../../shared/models/game.model';
import { GamePlayer } from '../../shared/models/game-player.model';

export interface State {
  ids: number[];
  entities: { [id: number]: Game };
  selectedGameId: number | null;
  loading: boolean;
  gameToEdit: {
    game: Game,
    dirty: boolean,
  };
}

const initialState: State = {
  ids: [],
  entities: {},
  selectedGameId: null,
  loading: false,
  gameToEdit: {
    game: null,
    dirty: false,
  },
};

export function reducer(state = initialState, action: gameActions.Actions): State {
  switch (action.type) {
    case gameActions.ActionTypes.FILTER_COMPLETE: {
      const games = action.payload;
      const newGames = games.filter(game => !state.entities[game.gameId]);

      const newGameIds = newGames.map(game => game.gameId);
      const newGameEntities = newGames.reduce((entities: { [id: number]: Game }, game: Game) => {
        return Object.assign(entities, {
          [game.gameId]: game
        });
      }, {});

      return Object.assign({}, state, {
        ids: [...state.ids, ...newGameIds],
        entities: Object.assign({}, state.entities, newGameEntities),
      });
    }

    case gameActions.ActionTypes.LOAD: {
      const game = action.payload;

      if (state.ids.indexOf(game.gameId) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [...state.ids, game.gameId],
        entities: Object.assign({}, state.entities, {
          [game.gameId]: game
        }),
      });
    }

    case gameActions.ActionTypes.SELECT: {
      return Object.assign({}, state, {
        selectedGameId: action.payload
      });
    }

    case gameActions.ActionTypes.DELETE_COMPLETE: {
      const game = action.payload;
      const newEntities = Object.assign({}, state.entities);
      // TODO confirm this works (and is necessary)
      delete newEntities[game.gameId];

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== game.gameId),
        entities: newEntities,
        selectedGameId: null,
      });
    }

    case gameActions.ActionTypes.CREATE_NEW: {
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: new Game(),
          dirty: false,
        },
      });
    }

    case gameActions.ActionTypes.SELECT_FOR_EDIT: {
      const gameCopy = cloneDeep(state.entities[action.payload]);
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: gameCopy,
          dirty: false,
        },
      });
    }

    case gameActions.ActionTypes.SAVE_UPDATED: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case gameActions.ActionTypes.SAVE_UPDATED_COMPLETE: {
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: null,
          dirty: false,
        },
      });
    }

    case gameActions.ActionTypes.SAVE_UPDATED_FAILURE: {
      return Object.assign({}, state, {
        loading: false,
      });
    }

    case gameActions.ActionTypes.UPDATE_COMPLETE: {
      const changes = action.payload;
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: Game.patchValues(state.gameToEdit.game, changes),
          dirty: true,
        },
      });
    }

    case gameActions.ActionTypes.SET_WINNER: {
      const winner = action.payload;
      const updatePlayers = state.gameToEdit.game.gamePlayers.map((gamePlayer: GamePlayer) =>
        GamePlayer.patchValues(gamePlayer, {
          isWinner: (gamePlayer.playerId === (winner && winner.playerId))
        }));
      const changes = {
        gamePlayers: updatePlayers,
      };
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: Game.patchValues(state.gameToEdit.game, changes),
          dirty: true,
        },
      });
    }

    case gameActions.ActionTypes.ADD_PLAYER: {
      let player = action.payload;
      if (!state.gameToEdit.game.gamePlayers.length) {
        player = GamePlayer.patchValues(player, {
          isWinner: true,
        });
      }
      const changes = {
        gamePlayers: [
          ...state.gameToEdit.game.gamePlayers,
          player,
        ]
      };
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: Game.patchValues(state.gameToEdit.game, changes),
          dirty: true,
        },
      });
    }

    case gameActions.ActionTypes.REMOVE_PLAYER: {
      const player = action.payload;
      const changes = {
        gamePlayers: state.gameToEdit.game.gamePlayers.filter((x) => x !== player),
      };
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: Game.patchValues(state.gameToEdit.game, changes),
          dirty: true,
        },
      });
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

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getLoading = (state: State) => state.loading;

export const getSelectedId = (state: State) => state.selectedGameId;

export const getGameForEdit = (state: State) => state.gameToEdit.game;
export const getGameForEditDirty = (state: State) => state.gameToEdit.dirty;
