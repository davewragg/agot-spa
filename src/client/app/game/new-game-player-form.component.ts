import {Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { find } from 'lodash';
import { Player } from '../shared/models/player.model';
import { GamePlayer } from '../shared/models/game-player.model';
import {FilterCriteria} from "../shared/models/filter-criteria.model";
import * as fromRoot from '../state-management/reducers/root';
import * as playerActions from '../state-management/actions/player';

@Component({
  moduleId: module.id,
  selector: 'agot-new-game-player-form',
  templateUrl: 'new-game-player-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGamePlayerFormComponent implements OnInit {
  @Output()
  updatePlayer: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  gamePlayer: GamePlayer = <GamePlayer>{};

  gamePlayerForm: FormGroup;

  selectedGroupId$: Observable<number>;
  players$: Observable<Player[]>;
  loading$: Observable<boolean>;

  constructor(private _formBuilder: FormBuilder,
              private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.players$ = store.select(fromRoot.getGroupPlayers);
    this.loading$ = store.select(fromRoot.getPlayersLoading);
  }

  ngOnInit() {
    this.populateForm();
  }

  onSelectedGroupChange(criteria: FilterCriteria) {
    const [playerGroupId] = criteria.playerGroupIds;
    this.store.dispatch(new playerActions.GetForGroupAction(playerGroupId));
    // TODO clear player in context, or leave?
  }

  onPlayerSelectChange(playerId: string) {
    // TODO handle this properly, clear deck if !players?
    // new gamePlayer? player from Players
    this.gamePlayer.playerId = playerId;
    this.gamePlayer.deck = null;
    console.log(this.gamePlayer);
  }

  onUpdateDeck({ deck, version }: any) {
    console.log(deck);
    this.gamePlayer.deck = deck;
    this.gamePlayer.thronesDbVersion = version;
    this.onSubmit();
  }

  onSubmit() {
    let players: Player[];
    this.players$.subscribe(x => players = x);
    const player = find(players, { playerId: this.gamePlayer.playerId });
    this.gamePlayer.player = player;
    console.log(this.gamePlayer);
    // this.updatePlayer.emit(this.gamePlayer);
    // TODO handle player loading errors
  }

  private populateForm() {
    let playerId = this.gamePlayer.playerId || '';
    this.gamePlayerForm = this._formBuilder.group({
      playerId: [playerId, Validators.required],
    });
  };
}
