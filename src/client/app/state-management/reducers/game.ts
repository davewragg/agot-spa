import { createSelector } from 'reselect';
import * as gameActions from '../actions/game';
import * as collectionActions from '../actions/collection';
import { Game } from '../../shared/models/game.model';


export interface State {
  ids: number[];
  entities: { [id: string]: Game };
  selectedGameId: string | null;
}

const initialState: State = {
  ids: [],
  entities: {},
  selectedGameId: null,
};

export function reducer(state = initialState, action: gameActions.Actions | collectionActions.Actions): State {
  switch (action.type) {
    case gameActions.ActionTypes.FILTER_COMPLETE:
    case collectionActions.ActionTypes.LOAD_SUCCESS: {
      const games = action.payload;
      const newGames = games.filter(game => !state.entities[game.gameId]);

      const newGameIds = newGames.map(game => game.gameId);
      const newGameEntities = newGames.reduce((entities: { [id: string]: Game }, game: Game) => {
        return Object.assign(entities, {
          [game.gameId]: game
        });
      }, {});

      return {
        ids: [...state.ids, ...newGameIds],
        entities: Object.assign({}, state.entities, newGameEntities),
        selectedGameId: state.selectedGameId
      };
    }

    case gameActions.ActionTypes.LOAD: {
      const game = action.payload;

      if (state.ids.indexOf(game.gameId) > -1) {
        return state;
      }

      return {
        ids: [...state.ids, game.gameId],
        entities: Object.assign({}, state.entities, {
          [game.gameId]: game
        }),
        selectedGameId: state.selectedGameId
      };
    }

    case gameActions.ActionTypes.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedGameId: action.payload
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

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedGameId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
