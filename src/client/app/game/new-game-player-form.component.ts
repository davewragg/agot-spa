import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { find } from 'lodash';
import { Player } from '../shared/models/player.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerActions from '../state-management/actions/player';

@Component({
  moduleId: module.id,
  selector: 'agot-new-game-player-form',
  templateUrl: 'new-game-player-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGamePlayerFormComponent {
  @Output()
  updatePlayer: EventEmitter<Player> = new EventEmitter<Player>();

  gamePlayerForm: FormGroup = new FormGroup({
    playerId: new FormControl('', Validators.required),
  });

  selectedGroupId$: Observable<number>;
  players$: Observable<Player[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.players$ = store.select(fromRoot.getGroupPlayers);
    this.loading$ = store.select(fromRoot.getPlayersLoading);
  }

  onSelectedGroupChange(criteria: FilterCriteria) {
    const [playerGroupId] = criteria.playerGroupIds;
    this.store.dispatch(new playerActions.GetForGroupAction(playerGroupId));
    this.clear();
  }

  onSubmit() {
    const playerId = this.gamePlayerForm.controls['playerId'].value;
    let players: Player[];
    this.players$.subscribe(x => players = x);
    const player = find(players, { playerId });
    this.updatePlayer.emit(player);
    this.clear();
  }

  private clear() {
    this.gamePlayerForm.controls['playerId'].setValue('');
  }
}
