import * as thronesDbActions from '../actions/thrones-db';
import * as gameActions from '../actions/game';
import { Deck } from '../../shared/models/deck.model';

export interface State {
  importedDeck: Deck;
  loading: boolean;
}

const initialState: State = {
  importedDeck: null,
  loading: false,
};

export function reducer(state = initialState, action: thronesDbActions.Actions | gameActions.Actions): State {
  switch (action.type) {
    case thronesDbActions.ActionTypes.IMPORT_DECK: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case thronesDbActions.ActionTypes.IMPORT_DECK_SUCCESS: {
      const deck = action.payload;
      return Object.assign({}, state, {
        importedDeck: deck,
        loading: false,
      });
    }

    case thronesDbActions.ActionTypes.IMPORT_DECK_FAILURE: {
      return Object.assign({}, state, {
        importedDeck: null,
        loading: false,
      });
    }

    case gameActions.ActionTypes.EDIT_PLAYER:
    case gameActions.ActionTypes.CANCEL_EDIT_PLAYER:
    case gameActions.ActionTypes.SAVE_UPDATED_COMPLETE: {
      return Object.assign({}, state, {
        importedDeck: null,
      });
    }

    default: {
      return state;
    }
  }
}

export const getImportedDeck = (state: State) => state.importedDeck;

export const getImportedDeckLoading = (state: State) => state.loading;
