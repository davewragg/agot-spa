import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
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

  constructor(private _FormBuilder:FormBuilder, private _ReferenceDataService:ReferenceDataService) {
    // TODO probably async
    this.deckTypes = this._ReferenceDataService.getDeckTypes();
  }

  ngOnInit() {
    this.serialiseGameToForm();
  }

  onSubmit() {
    if (!this.validateGame()) {
      return false;
    }
    const updatedGame = this.deserialiseFormToGame();
    this.update.emit(updatedGame);
  }

  onCancel(force:boolean) {
    if (!force && this.gameForm.dirty) {
      console.warn('dirty');
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
      return false;
    }
    return true;
  };

  private serialiseGameToForm() {
    this.gameForm = this._FormBuilder.group({
      date: [this.convertDateString(), Validators.required],
      coreSetCount: [this.game.coreSetCount, Validators.required],
      deckTypeId: [this.game.deckTypeId, Validators.required],
    });
    // clone players to new array
    this.gamePlayers = this.game.gamePlayers.map((gamePlayer) => Object.assign({}, gamePlayer));
  };

  private deserialiseFormToGame() {
    // FIXME not a deep copy
    // FIXME form values are strings
    const game = Object.assign({}, this.game, this.gameForm.value);

    // deckTypeId from form is a string
    game.deckType = this.deckTypes.find((deckType) => deckType.deckTypeId === +game.deckTypeId);

    // set updated players back to game
    this.game.gamePlayers = this.gamePlayers;

    // set date format to correct string
    // set deck from deckId? vice versa?
    // set other?
    return game;
  };

  private convertDateString() {
    // have to remove the time and timezone to populate the control correctly
    return this.game.date.slice(0, 10);
  };
}
