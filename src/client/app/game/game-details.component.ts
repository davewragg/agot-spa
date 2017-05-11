import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import * as fromRoot from '../state-management/reducers/root';
import { Game } from '../shared/models/game.model';
import * as gameActions from '../state-management/actions/game.actions';

@Component({
  moduleId: module.id,
  selector: 'agot-game-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'game-details.component.html',
})
export class GameDetailsComponent {
  game$: Observable<Game>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) {
    this.game$ = store.select(fromRoot.getGameForEdit);
    this.loading$ = store.select(fromRoot.getGameLoading);
  }

  onCancel() {
    const idParam = this.route.snapshot.params['id'];
    const destination = idParam ? ['games', idParam] : ['/'];
    this.store.dispatch(go(destination));
  }

  onSubmit() {
    let game: Game;
    // get from store synchronously
    this.game$.subscribe((currentGame) => game = currentGame);
    this.store.dispatch(new gameActions.SaveUpdateAction(game));
  }
}
