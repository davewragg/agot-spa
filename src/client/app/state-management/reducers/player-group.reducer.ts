import { createSelector } from 'reselect';
import * as playerGroupActions from '../actions/player-group.actions';
import { PlayerGroup } from '../../shared/models/player-group.model';

export interface State {
  ids: number[];
  entities: { [id: string]: PlayerGroup };
  selectedPlayerGroupId: number | null;
}

const initialState: State = {
  ids: [],
  entities: {},
  selectedPlayerGroupId: null,
};

export function reducer(state = initialState, action: playerGroupActions.Actions): State {
  switch (action.type) {
    case playerGroupActions.FILTER_COMPLETE: {
      const playerGroups = action.payload;
      const newPlayerGroups = playerGroups.filter(playerGroup => !state.entities[playerGroup.id]);

      const newPlayerGroupIds = newPlayerGroups.map(playerGroup => playerGroup.id);
      const newPlayerGroupEntities = newPlayerGroups.reduce((entities: { [id: string]: PlayerGroup }, playerGroup: PlayerGroup) => {
        return Object.assign(entities, {
          [playerGroup.id]: playerGroup
        });
      }, {});

      return Object.assign({}, state, {
        ids: [...state.ids, ...newPlayerGroupIds],
        entities: Object.assign({}, state.entities, newPlayerGroupEntities),
      });
    }

    case playerGroupActions.LOAD: {
      const playerGroup = action.payload;

      if (state.ids.indexOf(playerGroup.id) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [...state.ids, playerGroup.id],
        entities: Object.assign({}, state.entities, {
          [playerGroup.id]: playerGroup
        }),
      });
    }

    case playerGroupActions.SELECT: {
      return Object.assign({}, state, {
        selectedPlayerGroupId: action.payload
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

export const getSelectedId = (state: State) => state.selectedPlayerGroupId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
