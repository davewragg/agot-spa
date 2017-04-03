import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { find } from 'lodash';
import { Player } from '../shared/models/player.model';
import { GamePlayer } from '../shared/models/game-player.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerActions from '../state-management/actions/player';
// import * as gamePlayerActions from '../state-management/actions/game-player';
import { Deck } from '../shared/models/deck.model';

@Component({
  moduleId: module.id,
  selector: 'agot-new-game-player-form',
  templateUrl: 'new-game-player-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGamePlayerFormComponent {
  @Output()
  updatePlayer: EventEmitter<Player> = new EventEmitter<Player>();

  @Input()
  set gamePlayer(gamePlayer: GamePlayer) {
    if (gamePlayer) {
      this.gamePlayerForm.patchValue(gamePlayer);
      this.playerDeck = gamePlayer.deck;
    } else {
      this.gamePlayerForm.patchValue({ playerId: '' });
    }
  }

  playerDeck: Deck;

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
    // TODO clear player in context, or leave?
  }

  onPlayerSelectChange(playerId: string) {
    //   if (!playerId) {
    //     return;
    //   }
    //   // TODO handle this properly, clear deck if !players?
    //   // new gamePlayer? player from Players
    //   let players: Player[];
    //   this.players$.subscribe(x => players = x);
    //   const player = find(players, { playerId });
    //   this.store.dispatch(new gamePlayerActions.SetPlayerAction(player));
  }

  onSubmit() {
    const playerId = this.gamePlayerForm.controls['playerId'].value;
    let players: Player[];
    this.players$.subscribe(x => players = x);
    const player = find(players, { playerId });
    this.updatePlayer.emit(player);
  }

  //
  // onUpdateDeck(deckAndVersion: any) {
  //   this.store.dispatch(new gamePlayerActions.SetDeckAction(deckAndVersion));
  //   this.updatePlayer.emit(this.gamePlayerForm.controls['playerId'].value);
  // }
}
