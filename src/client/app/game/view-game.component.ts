import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Game } from '../shared/models/game.model';

@Component({
  moduleId: module.id,
  selector: 'agot-view-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'view-game.component.html',
})
export class ViewGameComponent {
  @Input()
  game: Game;
  @Output()
  edit: EventEmitter<Game> = new EventEmitter<Game>();
  @Output()
  deleteGame: EventEmitter<Game> = new EventEmitter<Game>();

  deleting: boolean = false;

  onEdit() {
    this.edit.emit(this.game);
  }

  onDelete(force?: boolean) {
    if (!force) {
      this.deleting = true;
    } else {
      this.deleteGame.emit(this.game);
    }
  }
}
