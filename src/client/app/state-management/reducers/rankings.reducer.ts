import * as rankingsActions from '../actions/rankings.actions';
import { SetOfResults } from '../../shared/models/set-of-results.model';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';

export interface State {
  loading: boolean;
  criteria: FilterCriteria;
  filteredRankings: SetOfResults | null;
}

const initialState: State = {
  loading: false,
  criteria: null,
  filteredRankings: null,
};

export function reducer(state = initialState, action: rankingsActions.Actions): State {
  switch (action.type) {
    case rankingsActions.FILTER: {
      const criteria = action.payload;

      if (!criteria) {
        return {
          loading: false,
          criteria,
          filteredRankings: state.filteredRankings,
        };
      }

      return Object.assign({}, state, {
        criteria,
        loading: true,
        filteredRankings: state.filteredRankings,
      });
    }

    case rankingsActions.FILTER_COMPLETE: {
      const rankings = action.payload;
      return {
        loading: false,
        criteria: state.criteria,
        filteredRankings: rankings,
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
export const getCriteria = (state: State) => state.criteria;
export const getLoading = (state: State) => state.loading;
export const getFilteredRankings = (state: State) => state.filteredRankings;
