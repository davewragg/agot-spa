import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {GamePlayer} from '../shared/models/game-player.model';
import {NewGamePlayerFormComponent} from './new-game-player-form.component';

@Component({
  selector: 'agot-game-player-row',
  moduleId: module.id,
  templateUrl: './game-player-row.html',
  styleUrls: ['./game-player-row.css'],
  directives: [NewGamePlayerFormComponent]
})
export class GamePlayerRowComponent {
  @Input()
  gamePlayer:GamePlayer;
  @Input()
  readOnly:boolean = false;
  @Output()
  updatePlayer:EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();
  @Output()
  removePlayer:EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  editing:boolean = false;

  onPlayerUpdate() {
    this.updatePlayer.emit(this.gamePlayer);
    this.editing = false;
  }

  onRemove() {
    this.removePlayer.emit(this.gamePlayer);
  }

  toggleEditing() {
    this.editing = !this.editing;
  }
}
