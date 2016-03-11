import {Component, Output, EventEmitter, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {NotificationService} from '../shared/services/notification.service';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {Agenda} from '../shared/models/agenda.model';
import {Faction} from '../shared/models/faction.model';
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
  agendas:Agenda[];
  factions:Faction[];

  // TODO move to deck component/service
  //private static validateDeck(newDeck:Deck):string {
  //  // validate agenda XOR secondary faction
  //  if (+newDeck.agendaId && newDeck.secondFactionId) {
  //    return 'pick one';
  //  }
  //  // validate banner is not the same as main faction
  //  if (+newDeck.agendaId === +newDeck.factionId) {
  //    return 'invalid banner';
  //  }
  //  // validate faction 1 != faction 2
  //  if (+newDeck.factionId === +newDeck.secondFactionId) {
  //    return 'invalid second faction';
  //  }
  //  return null;
  //}

  constructor(private _formBuilder:FormBuilder,
              private _referenceDataService:ReferenceDataService,
              private _playerService:PlayerService,
              private _notificationService:NotificationService) {
    // TODO probably async
    this.players = this._playerService.getPlayers();
    this.factions = this._referenceDataService.getFactions();
    this.agendas = this._referenceDataService.getAgendas();
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
  }

  onSubmit() {
    // FIXME newPlayer properties default to strings
    const updatedPlayer:GamePlayer = this.gamePlayerForm.value;
    //TODO proper validation here
    //const error = GamePlayerFormComponent.validateDeck(updatedPlayer.deck);
    //if (error) {
    //  this._notificationService.warn('Nope', error);
    //  console.warn(error);
    //  return;
    //}

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
    //let factionId = this.gamePlayer.factionId || '';
    //let agendaId = this.gamePlayer.agendaId || '';
    //let secondFactionId = this.gamePlayer.secondFactionId || '';
    this.gamePlayerForm = this._formBuilder.group({
      playerId: [playerId, Validators.required],
      //factionId: [factionId, Validators.required],
      //agendaId: [agendaId],
      //secondFactionId: [secondFactionId],
    });
  };

  private populatePlayer(gamePlayer:GamePlayer) {
    gamePlayer.player = this.players.find((player) => player.playerId === +gamePlayer.playerId);
  }
}
