import { createSelector } from 'reselect';
import { values } from 'lodash';
/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { ActionReducer, combineReducers } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitgames.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';
/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';
/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromCurrentPlayer from './current-player.reducer';
import * as fromSearchGames from './search-games.reducer';
import * as fromGames from './game.reducer';
import * as fromGamePlayer from './game-player.reducer';
import * as fromPlayers from './player.reducer';
import * as fromPlayerGroups from './player-group.reducer';
import * as fromRefData from './ref-data.reducer';
import * as fromRankings from './rankings.reducer';
import * as fromDecks from './decks.reducer';
import * as fromDeck from './deck.reducer';
import * as fromThronesDb from './thrones-db.reducer';
import * as fromLayout from './layout.reducer';
import { Game } from '../../shared/models/game.model';
import { Deck } from '../../shared/models/deck.model';


/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  currentPlayer: fromCurrentPlayer.State;
  search: fromSearchGames.State;
  games: fromGames.State;
  gamePlayer: fromGamePlayer.State;
  players: fromPlayers.State;
  playerGroups: fromPlayerGroups.State;
  rankings: fromRankings.State;
  decks: fromDecks.State;
  deck: fromDeck.State;
  thronesDb: fromThronesDb.State;
  refData: fromRefData.State;
  layout: fromLayout.State;
  router: fromRouter.RouterState;
}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  currentPlayer: fromCurrentPlayer.reducer,
  search: fromSearchGames.reducer,
  games: fromGames.reducer,
  gamePlayer: fromGamePlayer.reducer,
  players: fromPlayers.reducer,
  playerGroups: fromPlayerGroups.reducer,
  rankings: fromRankings.reducer,
  decks: fromDecks.reducer,
  deck: fromDeck.reducer,
  thronesDb: fromThronesDb.reducer,
  refData: fromRefData.reducer,
  layout: fromLayout.reducer,
  router: fromRouter.routerReducer,
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (String('<%= BUILD_TYPE %>') === 'prod') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

export const getRefDataState = (state: State) => state.refData;

export const getRefDataLoaded = createSelector(getRefDataState, fromRefData.getLoaded);
export const getRefDataLoading = createSelector(getRefDataState, fromRefData.getLoading);
export const getFactions = createSelector(getRefDataState, fromRefData.getFactions);
export const getAgendas = createSelector(getRefDataState, fromRefData.getAgendas);
export const getVenues = createSelector(getRefDataState, fromRefData.getVenues);
export const getSeasons = createSelector(getRefDataState, fromRefData.getSeasons);

export const getFactionsList = createSelector(getRefDataState, fromRefData.getFactionsList);
export const getAgendasList = createSelector(getRefDataState, fromRefData.getAgendasList);
export const getVenuesList = createSelector(getRefDataState, fromRefData.getVenuesList);

export const getCurrentPlayerState = (state: State) => state.currentPlayer;
export const getCurrentPlayer = createSelector(getCurrentPlayerState, fromCurrentPlayer.getCurrentPlayer);
// export const getCurrentPlayerLoading = createSelector(getCurrentPlayerState, fromCurrentPlayer.getLoading);
export const getCurrentPlayerGroupIds = createSelector(getCurrentPlayerState, fromCurrentPlayer.getCurrentPlayerGroupIds);

export const getPlayersState = (state: State) => state.players;
export const getGroupPlayerIds = createSelector(getPlayersState, fromPlayers.getIds);
export const getPlayersLoading = createSelector(getPlayersState, fromPlayers.getLoading);
export const getPlayerEntities = createSelector(getPlayersState, fromPlayers.getEntities);
export const getGroupPlayers = createSelector(getPlayerEntities, getGroupPlayerIds, (players, groupIds) => {
  return groupIds.map(id => players[id]);
});
// export const getSelectedPlayerId = createSelector(getPlayersState, fromPlayers.getSelectedId);
export const getSelectedPlayer = createSelector(getPlayersState, fromPlayers.getSelected);
export const getPlayerStatsFilterCriteria = createSelector(getPlayersState, fromPlayers.getStatsFilterCriteria);
export const getSelectedPlayerStats = createSelector(getPlayersState, fromPlayers.getSelectedPlayerStats);

export const getPlayerGroupState = (state: State) => state.playerGroups;
export const getPlayerGroupEntities = createSelector(getPlayerGroupState, fromPlayerGroups.getEntities);
export const getAllPlayerGroups = createSelector(getPlayerGroupState, fromPlayerGroups.getAll);
export const getMyPlayerGroups = createSelector(getCurrentPlayerGroupIds, getAllPlayerGroups, getPlayerEntities,
  (ids, groups, players) => {
    return groups.filter((group) => ids.includes(group.id)).map((group) =>
      Object.assign({}, group, {
        players: group.players.map((player) => players[player.playerId] ? players[player.playerId] : player)
      }));
  });
export const getAllButMyPlayerGroups = createSelector(getCurrentPlayerGroupIds, getAllPlayerGroups, getPlayerEntities,
  (ids, groups, players) => {
    return groups.filter((group) => !ids.includes(group.id)).map((group) =>
      Object.assign({}, group, {
        players: group.players.map((player) => players[player.playerId] ? players[player.playerId] : player)
      }));
  });
export const getSelectedPlayerGroupId = createSelector(getPlayerGroupState, fromPlayerGroups.getSelectedId);
export const getViewingPlayerGroup = createSelector(getPlayerGroupState, fromPlayerGroups.getViewing);
export const getPlayerGroupsLoading = createSelector(getPlayerGroupState, fromPlayerGroups.getLoading);

export const getDecksState = (state: State) => state.decks;
export const getFilteredDeckIds = createSelector(getDecksState, fromDecks.getIds);
export const getDecksCriteria = createSelector(getDecksState, fromDecks.getCriteria);
export const getDecksLoading = createSelector(getDecksState, fromDecks.getLoading);
export const getDeckEntities = createSelector(getDecksState, fromDecks.getEntities);
export const getFilteredDecks = createSelector(getDeckEntities, getFilteredDeckIds,
  (decks, searchIds) => searchIds.map(id => decks[id]));
// export const getAllDecks = createSelector(getDeckEntities, (decks) => {
//   // relies on all deck entities having been loaded on boot
//   return values(decks);
// });
export const getGroupDecks = createSelector(getDecksState, fromDecks.getGroupDecks);
// export const getSelectedDeckId = createSelector(getDecksState, fromDecks.getSelectedId);
export const getSelectedDeck = createSelector(getDecksState, fromDecks.getSelected);

export const getDeckForEdit = createSelector(getDecksState, fromDecks.getDeckForEdit);
export const getDeckForEditDirty = createSelector(getDecksState, fromDecks.getDeckForEditDirty);

export const getSelectedDeckState = (state: State) => state.deck;
export const getSelectedDeckStats = createSelector(getSelectedDeckState, fromDeck.getDeckStats);
export const getSelectedDeckStatsLoading = createSelector(getSelectedDeckState, fromDeck.getLoading);

export const getGamesState = (state: State) => state.games;

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * Once again our compose function comes in handy. From right to left, we
 * first select the games state then we pass the state to the game
 * reducer's getGames selector, finally returning an observable
 * of search results.
 *
 * Share memoizes the selector functions and publishes the result. This means
 * every time you call the selector, you will get back the same result
 * observable. Each subscription to the resultant observable
 * is shared across all subscribers.
 */
export const getGameEntities = createSelector(getGamesState, fromGames.getEntities);
export const getGameIds = createSelector(getGamesState, fromGames.getIds);
export const getSelectedGameId = createSelector(getGamesState, fromGames.getSelectedId);
export const getSelectedGame = createSelector(getGameEntities, getSelectedGameId, getVenues,
  (games, selectedGameId, venues) => {
    const game = games[selectedGameId];
    if (!game) return game;
    return Object.assign({}, game, {
      venue: venues[game.venueId],
    });
  });
export const getGameForEdit = createSelector(getGamesState, fromGames.getGameForEdit);
export const getGameForEditGamePlayers = createSelector(getGameForEdit, (game: Game) => {
  return game ? game.gamePlayers : [];
});
export const getGameForEditDirty = createSelector(getGamesState, fromGames.getGameForEditDirty);
export const getGameForEditPlayerId = createSelector(getGamesState, fromGames.getGameForEditPlayerId);
export const getGameLoading = createSelector(getGamesState, fromGames.getLoading);

export const getGamePlayerState = (state: State) => state.gamePlayer;
// export const getGamePlayerForEdit = createSelector(getGamePlayerState, fromGamePlayer.getGamePlayerForEdit);
// export const getGamePlayerForEditDirty = createSelector(getGamePlayerState, fromGamePlayer.getGamePlayerForEditDirty);

export const getSearchState = (state: State) => state.search;

export const getSearchGameIds = createSelector(getSearchState, fromSearchGames.getIds);
export const getSearchQuery = createSelector(getSearchState, fromSearchGames.getCriteria);
export const getSearchLoading = createSelector(getSearchState, fromSearchGames.getLoading);
/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of games in the store.
 */
export const getSearchResults = createSelector(getGameEntities, getSearchGameIds, getVenues,
  (games, searchIds, venues) => {
    return searchIds.map(id => {
      const game = games[id];
      if (!game) return game;
      return Object.assign({}, game, {
        venue: venues[game.venueId],
      });
    });
  });

export const getRankingsState = (state: State) => state.rankings;
export const getRankingsCriteria = createSelector(getRankingsState, fromRankings.getCriteria);
export const getRankingsLoading = createSelector(getRankingsState, fromRankings.getLoading);
export const getFilteredRankings = createSelector(getRankingsState, fromRankings.getFilteredRankings);

export const getThronesDbState = (state: State) => state.thronesDb;
export const getImportedDeck = createSelector(getThronesDbState, fromThronesDb.getImportedDeck);
export const getImportedDeckLoading = createSelector(getThronesDbState, fromThronesDb.getImportedDeckLoading);

/**
 * Layout Reducers
 */
// export const getLayoutState = (state: State) => state.layout;

// export const getShowSidenav = createSelector(getLayoutState, fromLayout.getShowSidenav);
