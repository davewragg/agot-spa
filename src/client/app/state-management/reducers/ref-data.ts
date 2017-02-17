import { createSelector } from 'reselect';
import { keyBy, values } from 'lodash';
import * as refDataActions from '../actions/ref-data';
import { Agenda } from '../../shared/models/agenda.model';
import { Faction } from '../../shared/models/faction.model';
import { Venue } from '../../shared/models/venue.model';
import { Season } from '../../shared/models/season.model';

export interface State {
  loaded: boolean;
  loading: boolean;
  factions: { [id: string]: Faction };
  agendas: { [id: string]: Agenda };
  venues: { [id: string]: Venue };
  seasons: Season[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  factions: {},
  agendas: {},
  venues: {},
  seasons: [],
};

function extractById(array: any[], baseKey: string): { [id: string]: any } {
  if (array && array.length) {
    const idKey = `${baseKey}Id`;
    return keyBy(array, idKey);
  }
  return {};
}

export function reducer(state = initialState, action: refDataActions.Actions): State {
  switch (action.type) {
    case refDataActions.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case refDataActions.ActionTypes.LOAD_SUCCESS: {
      const [
        factions,
        agendas,
        venues,
        seasons,
      ] = action.payload;

      return {
        loaded: true,
        loading: false,
        factions: extractById(factions, 'faction'),
        agendas: extractById(agendas, 'agenda'),
        venues: extractById(venues, 'venue'),
        seasons: seasons,
      };
    }

    default: {
      return state;
    }
  }
}

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getFactions = (state: State) => state.factions;
export const getAgendas = (state: State) => state.agendas;
export const getVenues = (state: State) => state.venues;
export const getSeasons = (state: State) => state.seasons;

export const getFactionsList = createSelector(getFactions, (entities) => {
  return values(entities);
});
export const getAgendasList = createSelector(getAgendas, (entities) => {
  return values(entities);
});
export const getVenuesList = createSelector(getVenues, (entities) => {
  return values(entities);
});

