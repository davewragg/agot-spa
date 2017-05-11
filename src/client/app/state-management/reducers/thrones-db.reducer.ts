import * as thronesDbActions from '../actions/thrones-db.actions';
import * as gameActions from '../actions/game.actions';
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
    case thronesDbActions.IMPORT_DECK: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case thronesDbActions.IMPORT_DECK_SUCCESS: {
      const deck = action.payload;
      return Object.assign({}, state, {
        importedDeck: deck,
        loading: false,
      });
    }

    case thronesDbActions.IMPORT_DECK_FAILURE: {
      return Object.assign({}, state, {
        importedDeck: null,
        loading: false,
      });
    }

    case gameActions.EDIT_PLAYER:
    case gameActions.CANCEL_EDIT_PLAYER:
    case gameActions.SAVE_UPDATED_COMPLETE: {
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
