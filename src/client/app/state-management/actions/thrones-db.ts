import { Action } from '@ngrx/store';
import { type } from '../util';
import { Deck } from '../../shared/models/deck.model';

export const ActionTypes = {
  IMPORT_DECK: type('[ThronesDB] Import Deck'),
  IMPORT_DECK_SUCCESS: type('[ThronesDB] Import Deck Success'),
  IMPORT_DECK_FAILURE: type('[ThronesDB] Import Deck Failure'),
};

export class ImportDeckAction implements Action {
  type = ActionTypes.IMPORT_DECK;

  constructor(public payload: number) {
  }
}

export class ImportDeckSuccessAction implements Action {
  type = ActionTypes.IMPORT_DECK_SUCCESS;

  constructor(public payload: Deck) {
  }
}

export class ImportDeckFailureAction implements Action {
  type = ActionTypes.IMPORT_DECK_FAILURE;

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
