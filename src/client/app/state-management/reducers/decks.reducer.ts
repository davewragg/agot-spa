import { createSelector } from 'reselect';
import { cloneDeep } from 'lodash';
import * as deckActions from '../actions/deck.actions';
import * as gameActions from '../actions/game.actions';
import { Deck } from '../../shared/models/deck.model';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';

export interface State {
  ids: number[];
  groupIds: number[];
  entities: { [id: number]: Deck };
  selectedDeckId: number;
  loading: boolean;
  criteria: FilterCriteria;
  deckToEdit: {
    deck: Deck,
    dirty: boolean,
  };
}

const initialState: State = {
  ids: [],
  groupIds: [],
  entities: {},
  selectedDeckId: null,
  loading: false,
  criteria: null,
  deckToEdit: {
    deck: null,
    dirty: false,
  },
};

export function reducer(state = initialState, action: deckActions.Actions | gameActions.Actions): State {
  switch (action.type) {
    case deckActions.FILTER: {
      const criteria = action.payload;

      if (!criteria) {
        return Object.assign({}, state, {
          ids: [],
          loading: false,
          criteria,
        });
      }

      return Object.assign({}, state, {
        criteria,
        loading: true
      });
    }

    case deckActions.FILTER_COMPLETE: {
      const decks = action.payload;
      const newDecks = decks.filter(deck => !state.entities[deck.deckId]);

      // const newDeckIds = newDecks.map(deck => deck.deckId);
      const newDeckEntities = newDecks.reduce((entities: { [id: string]: Deck }, deck: Deck) => {
        return Object.assign(entities, {
          [deck.deckId]: deck
        });
      }, {});

      return Object.assign({}, state, {
        ids: decks.map(deck => deck.deckId),
        entities: Object.assign({}, state.entities, newDeckEntities),
        loading: false,
      });
    }
    case deckActions.LOAD_FOR_GROUP: {
      const decks = action.payload;
      const newDecks = decks.filter(deck => !state.entities[deck.deckId]);

      // const newDeckIds = newDecks.map(deck => deck.deckId);
      const newDeckEntities = newDecks.reduce((entities: { [id: string]: Deck }, deck: Deck) => {
        return Object.assign(entities, {
          [deck.deckId]: deck
        });
      }, {});

      return Object.assign({}, state, {
        groupIds: decks.map(deck => deck.deckId),
        entities: Object.assign({}, state.entities, newDeckEntities),
        loading: false,
      });
    }

    case deckActions.LOAD: {
      const deck = action.payload;

      if (state.ids.indexOf(deck.deckId) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [...state.ids, deck.deckId],
        entities: Object.assign({}, state.entities, {
          [deck.deckId]: deck
        }),
        loading: false,
      });
    }

    case deckActions.SELECT: {
      return Object.assign({}, state, {
        selectedDeckId: action.payload,
        loading: false,
      });
    }

    case deckActions.SELECT_FOR_EDIT: {
      const deckCopy = cloneDeep(state.entities[action.payload]);
      return Object.assign({}, state, {
        loading: false,
        deckToEdit: {
          deck: deckCopy,
          dirty: false,
        },
      });
    }
    case gameActions.ADD_PLAYER: {
      return Object.assign({}, state, {
        deckToEdit: {
          deck: null,
          dirty: false,
        },
      });
    }
    case gameActions.EDIT_PLAYER: {
      const gamePlayer = action.payload;
      const deck = gamePlayer.deck;
      // can't edit imported decks
      const deckCopy = deck.thronesDbId ? new Deck() : cloneDeep(deck);
      return Object.assign({}, state, {
        deckToEdit: {
          deck: deckCopy,
          dirty: false,
        },
      });
    }

    case deckActions.SAVE_UPDATED: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case deckActions.SAVE_UPDATED_COMPLETE: {
      return Object.assign({}, state, {
        loading: false,
        deckToEdit: {
          deck: null,
          dirty: false,
        },
      });
    }

    case deckActions.SAVE_UPDATED_FAILURE: {
      return Object.assign({}, state, {
        loading: false,
      });
    }

    case deckActions.UPDATE_COMPLETE: {
      const changes = action.payload;
      return Object.assign({}, state, {
        loading: false,
        deckToEdit: {
          deck: Deck.patchValues(state.deckToEdit.deck, changes),
          dirty: true,
        },
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
export const getGroupIds = (state: State) => state.groupIds;

export const getSelectedId = (state: State) => state.selectedDeckId;

export const getCriteria = (state: State) => state.criteria;

export const getLoading = (state: State) => state.loading;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getGroupDecks = createSelector(getEntities, getGroupIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getDeckForEdit = (state: State) => state.deckToEdit.deck;
export const getDeckForEditDirty = (state: State) => state.deckToEdit.dirty;

// export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
//   return ids.map(id => entities[id]);
// });
