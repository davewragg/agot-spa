import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GamePlayer } from '../shared/models/game-player.model';
import { DeckSelectorComponent } from './deck-selector.component';
import { DeckLinkComponent } from '../shared/components/deck-link.component';

@Component({
  selector: 'agot-game-player-row',
  templateUrl: 'game/game-player-row.html',
  styleUrls: ['game/game-player-row.css'],
  directives: [DeckSelectorComponent, DeckLinkComponent]
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

  editing: boolean = false;

  onUpdateDeck({ deck, version }) {
    this.gamePlayer.deck = deck;
    this.gamePlayer.thronesDbVersion = version;
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
