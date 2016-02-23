import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {GamePlayerFormComponent} from './game-player-form.component';
import {Game} from '../shared/models/game.model';
import {DeckType} from '../shared/models/deck-type.model';
import {GamePlayer} from '../shared/models/game-player.model';

@Component({
  selector: 'agot-game-form',
  moduleId: module.id,
  templateUrl: './game-form.html',
  styleUrls: ['./game-form.css'],
  directives: [GamePlayerFormComponent]
})
export class GameFormComponent implements OnInit {
  @Input()
  game:Game;
  @Input()
  disabled:boolean;
  @Output()
  submit:EventEmitter<Game> = new EventEmitter<Game>();
  @Output()
  cancel:EventEmitter<any> = new EventEmitter<any>();

  gameForm:ControlGroup;

  deckTypes:DeckType[];

  constructor(private _FormBuilder:FormBuilder, private _ReferenceDataService:ReferenceDataService) {
    // TODO probably async
    this.deckTypes = this._ReferenceDataService.getDeckTypes();
  }

  ngOnInit() {
    this.serialiseGameToForm();
  }

  onSubmit() {
    const updatedGame = this.deserialiseFormToGame();
    this.submit.emit(updatedGame);
  }

  onCancel() {
    this.cancel.emit('cancelled');
  }

  onPlayerChange(gamePlayers: GamePlayer[]) {
    // TODO
    console.log(gamePlayers);
  }

  private deserialiseFormToGame() {
    // FIXME not a deep copy
    const game = Object.assign({}, this.game, this.gameForm.value);
    // clear sub-models (or just ignore?)
    //game.gamePlayers.length = 0;

    // deckTypeId from form is a string
    game.deckType = this.deckTypes.find((deckType) => deckType.deckTypeId === +game.deckTypeId);

    // set date format to correct string
    // set deck from deckId? vice versa?
    // set other?
    return game;
  };

  private serialiseGameToForm() {
    this.gameForm = this._FormBuilder.group({
      date: [this.convertDateString(), Validators.required],
      coreSetCount: [this.game.coreSetCount, Validators.required],
      deckTypeId: [this.game.deckTypeId, Validators.required],
      //gamePlayers: [this.game.gamePlayers, Validators.required],
    });
  };

  private convertDateString() {
    // have to remove the time and timezone to populate the control correctly
    return this.game.date.slice(0, 10);
  };
}
