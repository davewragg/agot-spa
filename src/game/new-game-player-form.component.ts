import {Component, Output, EventEmitter, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {GamePlayer} from '../shared/models/game-player.model';
import {Deck} from '../shared/models/deck.model';
import {DeckSelectorComponent} from './deck-selector.component';

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

  players:Player[];

  constructor(private _formBuilder:FormBuilder,
              private _playerService:PlayerService) {
    // TODO probably async
    this.players = this._playerService.getPlayers();
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
    // FIXME newPlayer properties default to strings
    const updatedPlayer:GamePlayer = this.gamePlayerForm.value;

    // TODO update or create?
    Object.assign(this.gamePlayer, updatedPlayer);
    this.populatePlayer(this.gamePlayer);
    console.log(this.gamePlayer);
    this.updatePlayer.emit(this.gamePlayer);
    // reset form
    //this.gamePlayerForm.reset
  }

  private populateForm() {
    let playerId = this.gamePlayer.playerId || '';
    this.gamePlayerForm = this._formBuilder.group({
      playerId: [playerId, Validators.required],
    });
  };

  private populatePlayer(gamePlayer:GamePlayer) {
    gamePlayer.player = this.players.find((player) => player.playerId === +gamePlayer.playerId);
  }
}
