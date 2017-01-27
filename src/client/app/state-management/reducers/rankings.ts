import * as rankingsActions from '../actions/rankings';
import { SetOfResults } from '../../shared/models/set-of-results.model';

export interface State {
  selectedRankings: SetOfResults | null;
}

const initialState: State = {
  selectedRankings: null,
};

export function reducer(state = initialState, action: rankingsActions.Actions): State {
  switch (action.type) {
    case rankingsActions.ActionTypes.FILTER_COMPLETE: {
      const rankings = action.payload;
      return {
        selectedRankings: rankings,
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

export const getSelectedRankings = (state: State) => state.selectedRankings;
