import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Config } from './shared/config/env.config';
import { Player } from './shared/models/player.model';
import './operators';
import { Store } from '@ngrx/store';
import * as fromRoot from './state-management/reducers/root';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'agot-app',
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  currentPlayer$: Observable<Player>;

  constructor(private store: Store<fromRoot.State>) {
    console.log('Environment config', Config);
    this.currentPlayer$ = store.select(fromRoot.getCurrentPlayer);
  }
}
