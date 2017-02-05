import * as deckActions from '../actions/deck';
import { DeckStats } from '../../shared/models/deck-stats.model';

export interface State {
  selectedDeckId: number | null;
  loading: boolean;
  deckStats: DeckStats;
}

const initialState: State = {
  selectedDeckId: null,
  loading: false,
  deckStats: null,
};

export function reducer(state = initialState, action: deckActions.Actions): State {
  switch (action.type) {
    case deckActions.ActionTypes.SELECT: {
      return {
        selectedDeckId: action.payload,
        loading: true,
        deckStats: state.deckStats,
      };
    }
    case deckActions.ActionTypes.SELECT_COMPLETE: {
      const stats = action.payload;

      return {
        selectedDeckId: state.selectedDeckId,
        loading: false,
        deckStats: stats,
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

export const getSelectedId = (state: State) => state.selectedDeckId;

export const getLoading = (state: State) => state.loading;

export const getDeckStats = (state: State) => state.deckStats;

