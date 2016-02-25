import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {GamePlayer} from '../shared/models/game-player.model';
import {GamePlayerFormComponent} from './game-player-form.component';

@Component({
  selector: 'agot-game-player-row',
  moduleId: module.id,
  templateUrl: './game-player-row.html',
  directives: [GamePlayerFormComponent]
})
export class GamePlayerRowComponent {
  @Input()
  gamePlayer:GamePlayer;
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
