import { Action } from '@ngrx/store';
import { Deck } from '../../shared/models/deck.model';

  export const IMPORT_DECK = '[ThronesDB] Import Deck';
  export const IMPORT_DECK_SUCCESS = '[ThronesDB] Import Deck Success';
  export const IMPORT_DECK_FAILURE = '[ThronesDB] Import Deck Failure';

export class ImportDeckAction implements Action {
  readonly type = IMPORT_DECK;

  constructor(public payload: number) {
  }
}

export class ImportDeckSuccessAction implements Action {
  readonly type = IMPORT_DECK_SUCCESS;

  constructor(public payload: Deck) {
  }
}

export class ImportDeckFailureAction implements Action {
  readonly type = IMPORT_DECK_FAILURE;

  constructor(public payload: Error | any) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = ImportDeckAction
  | ImportDeckSuccessAction
  | ImportDeckFailureAction;
