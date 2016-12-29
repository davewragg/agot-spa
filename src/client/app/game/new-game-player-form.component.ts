import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, ControlGroup, Validators } from '@angular/forms';
import { PlayerService } from '../shared/services/player.service';
import { Player } from '../shared/models/player.model';
import { GamePlayer } from '../shared/models/game-player.model';
// import { DeckSelectorComponent } from './deck-selector.component';
import { Observable } from 'rxjs/Observable';
// import { SpinnerComponent } from '../shared/components/spinner.component';

@Component({
  selector: 'agot-new-game-player-form',
  templateUrl: 'game/new-game-player-form.html',
  // directives: [DeckSelectorComponent, SpinnerComponent],
})
export class NewGamePlayerFormComponent implements OnInit {
  @Output()
  updatePlayer: EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  gamePlayer: GamePlayer = <GamePlayer>{};

  gamePlayerForm: ControlGroup;

  players: Observable<Player[]>;
  isLoading: boolean;

  constructor(private _formBuilder: FormBuilder,
              private _playerService: PlayerService) {
    this.isLoading = true;
    this.players = this._playerService.getPlayers();
    this.players.filter((x) => !!x && !!x.length).subscribe(
      () => this.isLoading = false,
      () => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  ngOnInit() {
    this.populateForm();
  }

  onPlayerSelectChange(playerId: string) {
    // TODO handle this properly, clear deck if !players?
    // new gamePlayer? player from Players
    this.gamePlayer.playerId = +playerId;
    this.gamePlayer.deck = null;
    console.log(this.gamePlayer);
  }

  onUpdateDeck({ deck, version }) {
    console.log(deck);
    this.gamePlayer.deck = deck;
    this.gamePlayer.thronesDbVersion = version;
    this.onSubmit();
  }

  onSubmit() {
    this.isLoading = true;
    this.getPlayer(this.gamePlayer).subscribe((player) => {
      this.gamePlayer.player = player;
      console.log(this.gamePlayer);
      this.updatePlayer.emit(this.gamePlayer);
      // TODO handle player loading errors
      this.isLoading = false;
    });
  }

  private populateForm() {
    let playerId = this.gamePlayer.playerId || '';
    this.gamePlayerForm = this._formBuilder.group({
      playerId: [playerId, Validators.required],
    });
  };

  private getPlayer(gamePlayer: GamePlayer): Observable<Player> {
    const playerId = +gamePlayer.playerId;
    return this._playerService.getPlayer(playerId);
  }
}