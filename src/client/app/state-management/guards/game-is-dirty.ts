import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../reducers/root';
import { EditGamePageComponent } from '../../game/edit-game.container';

@Injectable()
export class GameIsDirtyGuard implements CanDeactivate<EditGamePageComponent> {
  constructor(
    private store: Store<fromRoot.State>,
  ) { }

  isEditGameDirty(): Observable<boolean> {
    return this.store.select(fromRoot.getGameForEditDirty)
      .take(1);
  }

  canDeactivate(component: EditGamePageComponent): Observable<boolean> {
    return this.isEditGameDirty().map((dirty) => {
      if (!dirty) {
        return true;
      }
      // TODO do this properly with a dialogService
      return window.confirm('Abandon changes?');
    });
  }
}
