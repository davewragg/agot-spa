import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GamePlayer } from '../shared/models/game-player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-game-player-row',
  templateUrl: 'game-player-row.component.html',
  styleUrls: ['game-player-row.css'],
})
export class GamePlayerRowComponent {
  @Input()
  gamePlayer: GamePlayer;
  @Input()
  readOnly: boolean = false;
  @Output()
  updatePlayer: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();
  @Output()
  removePlayer: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();
  @Output()
  editPlayer: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();
  @Output()
  cancelEditPlayer: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  @Input()
  editing: boolean = false;

  onUpdateDeck({ deck, version }: any) {
    // this.gamePlayer.deck = deck;
    // this.gamePlayer.thronesDbVersion = version;
    // TODO emit set_deck? this is duplication
    this.updatePlayer.emit(GamePlayer.patchValues(this.gamePlayer, {
      deck,
      deckId: deck.deckId,
      thronesDbVersion: version,
    }));
    // this.editing = false;
  }

  onRemove() {
    this.removePlayer.emit(this.gamePlayer);
  }

  toggleEditing() {
    if (this.editing) {
      this.cancelEditPlayer.emit(this.gamePlayer);
    } else {
      this.editPlayer.emit(this.gamePlayer);
    }
  }
}
