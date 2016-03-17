import {Component, Output, EventEmitter, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {GamePlayer} from '../shared/models/game-player.model';
import {Deck} from '../shared/models/deck.model';
import {DeckSelectorComponent} from './deck-selector.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'agot-new-game-player-form',
  moduleId: module.id,
  templateUrl: './new-game-player-form.html',
  directives: [DeckSelectorComponent],
})
export class NewGamePlayerFormComponent implements OnInit {
  @Output()
  updatePlayer:EventEmitter<GamePlayer> = new EventEmitter<GamePlayer>();

  gamePlayer:GamePlayer = <GamePlayer>{};

  gamePlayerForm:ControlGroup;

  players:Observable<Player[]>;

  constructor(private _formBuilder:FormBuilder,
              private _playerService:PlayerService) {
    this.players = this._playerService.players;
  }

  ngOnInit() {
    this.populateForm();
  }

  onPlayerSelectChange(playerId:string) {
    // TODO handle this properly, clear deck if !players?
    // new gamePlayer? player from Players
    this.gamePlayer.playerId = +playerId;
    this.gamePlayer.deck = null;
    console.log(this.gamePlayer);
  }

  onUpdateDeck(deck:Deck) {
    console.log(deck);
    this.gamePlayer.deck = deck;
    this.onSubmit();
  }

  onSubmit() {
    this.getPlayer(this.gamePlayer).subscribe((player) => {
      this.gamePlayer.player = player;
      console.log(this.gamePlayer);
      this.updatePlayer.emit(this.gamePlayer);
      // TODO handle player loading errors
    });
  }

  private populateForm() {
    let playerId = this.gamePlayer.playerId || '';
    this.gamePlayerForm = this._formBuilder.group({
      playerId: [playerId, Validators.required],
    });
  };

  private getPlayer(gamePlayer:GamePlayer):Observable<Player> {
    const playerId = +gamePlayer.playerId;
    return this._playerService.getPlayer(playerId);
  }
}
