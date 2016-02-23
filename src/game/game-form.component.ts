import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {Game} from '../shared/models/game.model';

@Component({
  selector: 'agot-game-form',
  moduleId: module.id,
  templateUrl: './game-form.html',
  styleUrls: ['./game-form.css'],
})
export class GameFormComponent implements OnInit {
  @Input()
  game:Game;
  @Output()
  submit = new EventEmitter<any>(); // TODO check type?

  gameForm:ControlGroup;

  constructor(private _FormBuilder:FormBuilder) {
  }

  ngOnInit() {
    this.serialiseGameToForm();
  }

  onSubmit() {
    console.log(this.gameForm.value, this.game);
    this.deserialiseFormToGame();
    // TODO
    //this.submit.emit(this.game);
  }

  private deserialiseFormToGame() {
    // set date to string
    // set deck from deckId?
    // set other?
  };

  private serialiseGameToForm() {
    this.gameForm = this._FormBuilder.group({
      date: [this.convertDateString(), Validators.required],
      coreSetCount: [this.game.coreSetCount, Validators.required],
      deckType: [this.game.deckType.deckTypeId, Validators.required],
      gamePlayers: [this.game.gamePlayers, Validators.required],
    });
  };

  private convertDateString() {
    // have to remove the time and timezone to populate the control correctly
    return this.game.date.slice(0, 10);
  };
}
