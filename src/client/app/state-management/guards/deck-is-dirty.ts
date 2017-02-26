import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../reducers/root';
import { EditDeckPageComponent } from '../../deck/edit-deck.container';

@Injectable()
export class DeckIsDirtyGuard implements CanDeactivate<EditDeckPageComponent> {
  constructor(
    private store: Store<fromRoot.State>,
  ) { }

  isEditDeckDirty(): Observable<boolean> {
    return this.store.select(fromRoot.getDeckForEditDirty)
      .take(1);
  }

  canDeactivate(component: EditDeckPageComponent): Observable<boolean> {
    return this.isEditDeckDirty().map((dirty) => {
      if (!dirty) {
        return true;
      }
      // TODO do this properly with a dialogService
      return window.confirm('Abandon changes?');
    });
  }
}
