import { createSelector } from 'reselect';
import * as playerActions from '../actions/player';
import { PlayerStats } from '../../shared/models/player-stats.model';
import { Player } from '../../shared/models/player.model';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';

export interface State {
  ids: string[];
  entities: { [id: string]: Player };
  selectedPlayerGroupId: number | null;
  selectedPlayerId: string | null;
  statsFilterCriteria: FilterCriteria;
  loading: boolean;
  playerStats: PlayerStats;
}

const initialState: State = {
  ids: [],
  entities: {},
  selectedPlayerGroupId: null,
  selectedPlayerId: null,
  statsFilterCriteria: null,
  loading: false,
  playerStats: null,
};

export function reducer(state = initialState, action: playerActions.Actions): State {
  switch (action.type) {
    case playerActions.ActionTypes.GET_FOR_GROUP: {
      const selectedPlayerGroupId = action.payload;

      return Object.assign({}, state, {
        selectedPlayerGroupId,
        loading: true
      });
    }

    case playerActions.ActionTypes.GET_FOR_GROUP_COMPLETE: {
      const players = action.payload;
      const newPlayers = players.filter(player => !state.entities[player.playerId]);

      // const newPlayerIds = newPlayers.map(player => player.playerId);
      const newPlayerEntities = newPlayers.reduce((entities: { [id: string]: Player }, player: Player) => {
        return Object.assign(entities, {
          [player.playerId]: player
        });
      }, {});

      return Object.assign({}, state, {
        ids: players.map(player => player.playerId),
        entities: Object.assign({}, state.entities, newPlayerEntities),
        loading: false,
      });
    }

    case playerActions.ActionTypes.LOAD: {
      const player = action.payload;

      if (state.ids.indexOf(player.playerId) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [...state.ids, player.playerId],
        entities: Object.assign({}, state.entities, {
          [player.playerId]: player
        }),
        // loading: false,
      });
    }


    case playerActions.ActionTypes.SELECT: {
      const { playerId, criteria } = action.payload;
      return Object.assign({}, state, {
        selectedPlayerId: playerId,
        statsFilterCriteria: criteria,
        loading: true,
      });
    }

    case playerActions.ActionTypes.SELECT_COMPLETE: {
      const stats = action.payload;

      return Object.assign({}, state, {
        playerStats: stats,
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

export const getSelectedGroupId = (state: State) => state.selectedPlayerGroupId;

export const getSelectedId = (state: State) => state.selectedPlayerId;

export const getStatsFilterCriteria = (state: State) => state.statsFilterCriteria;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getLoading = (state: State) => state.loading;

export const getSelectedPlayerStats = (state: State) => state.playerStats;

