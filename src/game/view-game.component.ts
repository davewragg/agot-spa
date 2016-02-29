import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Game} from '../shared/models/game.model';
import {GamePlayersComponent} from './game-players.component';
import {DateFormatPipe} from '../shared/pipes/date-format-pipe';

@Component({
  selector: 'agot-view-game',
  moduleId: module.id,
  templateUrl: './view-game.html',
  directives: [GamePlayersComponent, ROUTER_DIRECTIVES],
  pipes: [DateFormatPipe]
})
export class ViewGameComponent {
  @Input()
  game:Game;
  @Output()
  edit:EventEmitter<Game> = new EventEmitter<Game>();
  @Output()
  deleteGame:EventEmitter<Game> = new EventEmitter<Game>();

  deleting:boolean = false;

  onEdit() {
    this.edit.emit(this.game);
  }

  onDelete(force:boolean) {
    if (!force) {
      this.deleting = true;
    } else {
      this.deleteGame.emit(this.game);
    }
  }
}
