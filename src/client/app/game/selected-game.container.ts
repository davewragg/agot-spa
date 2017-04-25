import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import * as fromRoot from '../state-management/reducers/root';
import * as gameActions from '../state-management/actions/game.actions';
import { Game } from '../shared/models/game.model';

@Component({
  selector: 'agot-selected-game-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-1">
      <h2>View Game</h2>

      <agot-view-game [game]="game$ | async" (edit)="onEdit()" (deleteGame)="onDelete()"></agot-view-game>

    </div>
    <agot-spinner [isRunning]="loading$ | async"></agot-spinner>

    <h3 *ngIf="!(loading$ | async) && !(game$ | async)" class="alert alert-danger">Game not found</h3>
  `
})
export class SelectedGamePageComponent {
  game$: Observable<Game>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) {
    this.game$ = store.select(fromRoot.getSelectedGame);
    this.loading$ = store.select(fromRoot.getSearchLoading); // TODO cough
  }

  onEdit() {
    this.store.dispatch(go(['games', this.route.snapshot.params['id'], 'edit']));
  }

  onDelete() {
    let game: Game;
    // sync store get
    this.game$.subscribe(x => game = x);
    this.store.dispatch(new gameActions.DeleteAction(game));
  }
}
