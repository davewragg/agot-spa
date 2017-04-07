import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { every } from 'lodash';
import { NotificationService } from '../shared/services/notification.service';
import { Game } from '../shared/models/game.model';
import { Venue } from '../shared/models/venue.model';
import { GamePlayer } from '../shared/models/game-player.model';
import * as fromRoot from '../state-management/reducers/root';
import * as gameActions from '../state-management/actions/game';

@Component({
  moduleId: module.id,
  selector: 'agot-game-form',
  templateUrl: 'game-form.component.html',
  styleUrls: ['game-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameFormComponent implements OnInit, OnDestroy {
  @Input()
  set game(game: Game) {
    if (game) {
      this.gameForm.patchValue(Object.assign({}, game, {
        date: GameFormComponent.convertDateString(game.date),
        venueId: game.venueId || '',
      }), { emitEvent: false });
    }
  }

  @Input()
  disabled: boolean;

  @Output()
  update: EventEmitter<Game> = new EventEmitter<Game>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  gameForm: FormGroup = new FormGroup({
    date: new FormControl('', Validators.required),
    venueId: new FormControl('', Validators.required),
  });

  loading$: Observable<boolean>;
  cancelling: boolean = false;

  gamePlayers$: Observable<GamePlayer[]>;
  venues$: Observable<Venue[]>;
  refDataLoading$: Observable<boolean>;
  formDirty$: Observable<boolean>;

  private changesSub: any;

  private static convertDateString(date: string) {
    // have to remove the time and timezone to populate the control correctly
    return date.slice(0, 16);
  };

  constructor(private store: Store<fromRoot.State>,
              private notificationService: NotificationService) {
    this.gamePlayers$ = this.store.select(fromRoot.getGameForEditGamePlayers);
    this.venues$ = this.store.select(fromRoot.getVenuesList);
    this.refDataLoading$ = store.select(fromRoot.getRefDataLoading);
    this.formDirty$ = store.select(fromRoot.getGameForEditDirty);
    this.loading$ = store.select(fromRoot.getGameLoading);
  }

  ngOnInit() {
    this.changesSub = this.gameForm.valueChanges.debounceTime(400).subscribe((changes) => {
      this.store.dispatch(new gameActions.UpdateAction(changes));
    });
  }

  ngOnDestroy(): void {
    this.changesSub.unsubscribe();
  }

  onSubmit() {
    if (!this.validateGame()) {
      return;
    }
    this.update.emit(this.game);
  }

  onCancel(force?: boolean) {
    let dirty: boolean;
    this.formDirty$.subscribe((d) => dirty = d);
    if (!force && dirty) {
      this.cancelling = true;
    } else {
      this.cancel.emit('cancelled');
    }
  }

  private validateGame() {
    let gamePlayers: GamePlayer[];
    this.gamePlayers$.subscribe(x => gamePlayers = x);
    if (gamePlayers.length < 2) {
      console.warn('not enough players');
      this.notificationService.warn('Nope', 'not enough players');
      return false;
    }
    return every(gamePlayers, (gamePlayer) => {
      if (!gamePlayer.deck || !gamePlayer.deck.factionId) {
        console.warn(`invalid deck for ${gamePlayer.player.name}`);
        this.notificationService.warn('Nope', `Invalid deck for ${gamePlayer.player.name}`);
        return false;
      }
      return true;
    });
  };
}
