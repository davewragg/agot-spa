import {Component, Input, OnInit} from 'angular2/core';
import {GameService} from '../shared/services/game.service';
import {Game} from '../shared/models/game.model';
import {FormBuilder} from 'angular2/common';

@Component({
  selector: 'agot-game-form',
  moduleId: module.id,
  templateUrl: './game-form.html',
  styleUrls: ['./game-form.css']
})
export class GameFormComponent implements OnInit {
  @Input()
  game:Game;

  ngOnInit() {
    console.log(this.game);
  }

  constructor(private _GameService:GameService, fb:FormBuilder) {
  }

  onSubmit() {
    console.log(this.game);
  }
}
