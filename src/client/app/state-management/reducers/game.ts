import { cloneDeep, findIndex } from 'lodash';
import * as gameActions from '../actions/game';
import { Game } from '../../shared/models/game.model';
import { GamePlayer } from '../../shared/models/game-player.model';
import { Deck } from '../../shared/models/deck.model';

export interface State {
  ids: number[];
  entities: { [id: number]: Game };
  selectedGameId: number | null;
  loading: boolean;
  gameToEdit: {
    game: Game,
    dirty: boolean,
    editPlayerId: string,
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
    editPlayerId: null,
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
          editPlayerId: null,
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
          editPlayerId: null,
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
          editPlayerId: null,
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
          editPlayerId: state.gameToEdit.editPlayerId,
        },
      });
    }

    case gameActions.ActionTypes.SET_WINNER: {
      const winner = action.payload;
      const gamePlayers = state.gameToEdit.game.gamePlayers;
      const updatePlayers = gamePlayers.map((gamePlayer: GamePlayer) =>
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
          editPlayerId: state.gameToEdit.editPlayerId,
        },
      });
    }

    case gameActions.ActionTypes.ADD_PLAYER: {
      let player = action.payload;
      const gamePlayers = state.gameToEdit.game.gamePlayers;
      const gamePlayer = GamePlayer.patchValues(new GamePlayer(), {
        isWinner: !gamePlayers.length,
        player,
        playerId: player.playerId,
        deck: new Deck(),
      });
      const changes = {
        gamePlayers: [
          ...gamePlayers,
          gamePlayer,
        ]
      };
      return Object.assign({}, state, {
        gameToEdit: {
          game: Game.patchValues(state.gameToEdit.game, changes),
          dirty: true,
          editPlayerId: gamePlayer.playerId,
        },
      });
  }

    case gameActions.ActionTypes.EDIT_PLAYER: {
      const player = action.payload;
      return Object.assign({}, state, {
        gameToEdit: {
          game: state.gameToEdit.game,
          dirty: state.gameToEdit.dirty,
          editPlayerId: player.playerId,
        }
      });
    }

    case gameActions.ActionTypes.CANCEL_EDIT_PLAYER: {
      return Object.assign({}, state, {
        gameToEdit: {
          game: state.gameToEdit.game,
          dirty: state.gameToEdit.dirty,
          editPlayerId: null,
        }
      });
    }

    case gameActions.ActionTypes.UPDATE_PLAYER: {
      let player = action.payload;
      const gamePlayers = state.gameToEdit.game.gamePlayers;
      const index = findIndex(gamePlayers, { playerId: player.playerId });
      const changes = {
        gamePlayers: [
          ...gamePlayers.slice(0, index),
          player,
          ...gamePlayers.slice(index + 1),
        ]
      };
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: Game.patchValues(state.gameToEdit.game, changes),
          dirty: true,
          editPlayerId: null,
        },
      });
    }

    case gameActions.ActionTypes.REMOVE_PLAYER: {
      const player = action.payload;
      const gamePlayers = state.gameToEdit.game.gamePlayers;
      const changes = {
        gamePlayers: gamePlayers.filter((x) => x !== player),
      };
      return Object.assign({}, state, {
        loading: false,
        gameToEdit: {
          game: Game.patchValues(state.gameToEdit.game, changes),
          dirty: true,
          editPlayerId: state.gameToEdit.editPlayerId,
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
export const getGameForEditPlayerId = (state: State) => state.gameToEdit.editPlayerId;
