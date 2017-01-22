import * as collection from '../actions/collection';

export interface State {
  loaded: boolean;
  loading: boolean;
  ids: number[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  ids: []
};

export function reducer(state = initialState, action: collection.Actions): State {
  switch (action.type) {
    case collection.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case collection.ActionTypes.LOAD_SUCCESS: {
      const games = action.payload;

      return {
        loaded: true,
        loading: false,
        ids: games.map(game => game.gameId)
      };
    }

    case collection.ActionTypes.ADD_GAME_SUCCESS:
    case collection.ActionTypes.REMOVE_GAME_FAIL: {
      const game = action.payload;

      if (state.ids.indexOf(game.gameId) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [...state.ids, game.gameId]
      });
    }

    case collection.ActionTypes.REMOVE_GAME_SUCCESS:
    case collection.ActionTypes.ADD_GAME_FAIL: {
      const game = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== game.gameId)
      });
    }

    default: {
      return state;
    }
  }
}

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
