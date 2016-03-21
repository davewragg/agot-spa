import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {NotificationService} from '../shared/services/notification.service';
import {GamePlayersComponent} from './game-players.component';
import {Game} from '../shared/models/game.model';
import {DeckType} from '../shared/models/deck-type.model';
import {GamePlayer} from '../shared/models/game-player.model';

@Component({
  selector: 'agot-game-form',
  moduleId: module.id,
  templateUrl: './game-form.html',
  styleUrls: ['./game-form.css'],
  directives: [GamePlayersComponent]
})
export class GameFormComponent implements OnInit {
  @Input()
  game:Game;
  @Input()
  disabled:boolean;
  @Output()
  update:EventEmitter<Game> = new EventEmitter<Game>();
  @Output()
  cancel:EventEmitter<any> = new EventEmitter<any>();

  gameForm:ControlGroup;
  gamePlayers:GamePlayer[];
  cancelling:boolean = false;

  deckTypes:DeckType[];

  constructor(private _FormBuilder:FormBuilder,
              private _referenceDataService:ReferenceDataService,
              private notificationService:NotificationService) {
    this.deckTypes = this._referenceDataService.getDeckTypes();
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

  onCancel(force:boolean) {
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
    });
    // clone players to new array
    this.gamePlayers = this.game.gamePlayers.map((gamePlayer) => Object.assign({}, gamePlayer));
  };

  private deserialiseFormToGame() {
    // FIXME not a deep copy
    // FIXME form values are strings
    const game = Object.assign({}, this.game, this.gameForm.value);

    // set updated players back to game
    this.game.gamePlayers = this.gamePlayers;

    return game;
  };

  private convertDateString() {
    // have to remove the time and timezone to populate the control correctly
    return this.game.date.slice(0, 16);
  };
}
