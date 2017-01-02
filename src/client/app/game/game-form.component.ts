import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
// TODO omfg forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ReferenceDataService } from '../shared/services/reference-data.service';
import { NotificationService } from '../shared/services/notification.service';
// import { GamePlayersComponent } from './game-players.component';
import { Game } from '../shared/models/game.model';
import { GamePlayer } from '../shared/models/game-player.model';
import { Venue } from '../shared/models/venue.model';
// import { SpinnerComponent } from '../shared/components/spinner.component';
import * as _ from 'lodash';

@Component({
  moduleId: module.id,
  selector: 'agot-game-form',
  templateUrl: 'game-form.html',
  styleUrls: ['game-form.css'],
  // directives: [GamePlayersComponent, SpinnerComponent]
})
export class GameFormComponent implements OnInit {
  @Input()
  game: Game;
  @Input()
  disabled: boolean;
  @Output()
  update: EventEmitter<Game> = new EventEmitter<Game>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  gameForm: FormGroup;
  gamePlayers: GamePlayer[];
  cancelling: boolean = false;

  venues: Observable<Venue[]>;
  isLoading: boolean;

  constructor(private _FormBuilder: FormBuilder,
              private _referenceDataService: ReferenceDataService,
              private notificationService: NotificationService) {
    this.isLoading = true;
    this.venues = this._referenceDataService.venues;
    this.venues.filter((x) => !!x && !!x.length).subscribe(
      () => this.isLoading = false,
      () => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  ngOnInit() {
    this.serialiseGameToForm();
  }

  onSubmit() {
    if (!this.validateGame()) {
      return;
    }
    const updatedGame = this.deserialiseFormToGame();
    this.update.emit(updatedGame);
  }

  onCancel(force: boolean) {
    if (!force && this.gameForm.dirty) {
      this.cancelling = true;
    } else {
      this.cancel.emit('cancelled');
    }
  }

  onPlayerChange() {
    // TODO anything else here?
    this.gameForm.markAsDirty(true);
  }

  private validateGame() {
    if (this.gamePlayers.length < 2) {
      console.warn('not enough players');
      this.notificationService.warn('Nope', 'not enough players');
      return false;
    }
    return true;
  };

  private serialiseGameToForm() {
    this.gameForm = this._FormBuilder.group({
      date: [this.convertDateString(), Validators.required],
      venueId: [this.game.venueId || '', Validators.required],
    });
    // clone players to new array
    this.gamePlayers = this.game.gamePlayers.map((gamePlayer) => Object.assign({}, gamePlayer));
  };

  private deserialiseFormToGame(): Game {
    const game = _.cloneDeep(this.game);
    Object.assign(game, this.gameForm.value);
    // FIXME form values are strings
    game.venueId = +game.venueId;

    // set updated players back to game
    game.gamePlayers = _.cloneDeep(this.gamePlayers);

    return game;
  };

  private convertDateString() {
    // have to remove the time and timezone to populate the control correctly
    return this.game.date.slice(0, 16);
  };
}
