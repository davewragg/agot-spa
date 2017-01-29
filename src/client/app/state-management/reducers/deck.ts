import { createSelector } from 'reselect';
import * as deckActions from '../actions/deck';
import { Deck } from '../../shared/models/deck.model';
import { FilterCriteria } from '../../shared/models/filter-criteria.model';

export interface State {
  ids: number[];
  entities: { [id: string]: Deck };
  selectedDeckId: string | null;
  loading: boolean;
  criteria: FilterCriteria;
}

const initialState: State = {
  ids: [],
  entities: {},
  selectedDeckId: null,
  loading: false,
  criteria: null,
};

export function reducer(state = initialState, action: deckActions.Actions): State {
  switch (action.type) {
    case deckActions.ActionTypes.FILTER: {
      const criteria = action.payload;

      if (!criteria) {
        return {
          ids: [],
          entities: state.entities,
          selectedDeckId: state.selectedDeckId,
          loading: false,
          criteria,
        };
      }

      return Object.assign({}, state, {
        criteria,
        loading: true
      });
    }

    case deckActions.ActionTypes.FILTER_COMPLETE: {
      const decks = action.payload;
      const newDecks = decks.filter(deck => !state.entities[deck.deckId]);

      const newDeckIds = newDecks.map(deck => deck.deckId);
      const newDeckEntities = newDecks.reduce((entities: { [id: string]: Deck }, deck: Deck) => {
        return Object.assign(entities, {
          [deck.deckId]: deck
        });
      }, {});

      return {
        ids: [...state.ids, ...newDeckIds],
        entities: Object.assign({}, state.entities, newDeckEntities),
        selectedDeckId: state.selectedDeckId,
        loading: false,
        criteria: state.criteria,
      };
    }

    case deckActions.ActionTypes.LOAD: {
      const deck = action.payload;

      if (state.ids.indexOf(deck.deckId) > -1) {
        return state;
      }

      return {
        ids: [...state.ids, deck.deckId],
        entities: Object.assign({}, state.entities, {
          [deck.deckId]: deck
        }),
        selectedDeckId: state.selectedDeckId,
        loading: false,
        criteria: state.criteria,
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

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedDeckId;

export const getCriteria = (state: State) => state.criteria;

export const getLoading = (state: State) => state.loading;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
