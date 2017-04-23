import { createSelector } from 'reselect';
import { union } from 'lodash';
import { PlayerGroup } from '../../shared/models/player-group.model';
import * as playerGroupActions from '../actions/player-group.actions';

export interface State {
  ids: number[];
  entities: { [id: string]: PlayerGroup };
  selectedPlayerGroupId: number | null;
  viewingId: number | null;
  loading: boolean;
}

const initialState: State = {
  ids: [],
  entities: {},
  selectedPlayerGroupId: null,
  viewingId: null,
  loading: false,
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
        loading: false,
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

    case playerGroupActions.FILTER: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case playerGroupActions.SELECT: {
      return Object.assign({}, state, {
        selectedPlayerGroupId: action.payload,
      });
    }

    case playerGroupActions.SET_FOR_EDIT: {
      return Object.assign({}, state, {
        viewingId: action.payload,
      });
    }

    case playerGroupActions.JOIN:
    case playerGroupActions.SAVE: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case playerGroupActions.JOIN_COMPLETE:
    case playerGroupActions.SAVE_COMPLETE: {
      const playerGroup = action.payload;

      return Object.assign({}, state, {
        ids: union(state.ids, [playerGroup.id]),
        entities: Object.assign({}, state.entities, {
          [playerGroup.id]: playerGroup
        }),
        loading: false,
      });
    }

    case playerGroupActions.JOIN_FAILURE:
    case playerGroupActions.SAVE_FAILURE: {
      return Object.assign({}, state, {
        loading: false,
      });
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedPlayerGroupId;

export const getViewingId = (state: State) => state.viewingId;

export const getLoading = (state: State) => state.loading;

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
