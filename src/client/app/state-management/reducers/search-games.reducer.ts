import * as game from '../actions/game.actions';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';
import { Game } from '../../shared/models/game.model';

export interface State {
  ids: number[];
  loading: boolean;
  criteria: FilterCriteria;
  totalRecords: number;
}

const initialState: State = {
  ids: [],
  loading: false,
  criteria: null,
  totalRecords: 0,
};

export function reducer(state = initialState, action: game.Actions): State {
  switch (action.type) {
    case game.FILTER: {
      const criteria = action.payload;

      // if (!criteria) {
      //   return {
      //     ids: [],
      //     loading: false,
      //     criteria
      //   };
      // }

      return Object.assign({}, state, {
        criteria,
        loading: true
      });
    }

    case game.FILTER_COMPLETE: {
      const games = <Game[]>action.payload.records;
      const totalRecords = action.payload.totalRecords;

      return {
        ids: games.map(game => game.gameId),
        loading: false,
        criteria: state.criteria,
        totalRecords,
      };
    }

    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;

export const getCriteria = (state: State) => state.criteria;

export const getLoading = (state: State) => state.loading;

export const getTotalRecords = (state: State) => state.totalRecords;
