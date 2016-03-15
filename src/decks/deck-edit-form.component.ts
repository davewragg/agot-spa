import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {NotificationService} from '../shared/services/notification.service';
import {Agenda} from '../shared/models/agenda.model';
import {Faction} from '../shared/models/faction.model';
import {Deck} from '../shared/models/deck.model';
import {DeckClass} from '../shared/models/deck-class.model';
import {Control} from 'angular2/common';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'agot-deck-edit-form',
  moduleId: module.id,
  templateUrl: './deck-edit-form.component.html'
})
export class DeckEditFormComponent implements OnInit {
  @Input()
  creating:boolean;
  @Input()
  deck:Deck;
  @Output()
  updateDeck:EventEmitter<Deck> = new EventEmitter<Deck>();

  deckForm:ControlGroup;

  agendas:Observable<Agenda[]>;
  factions:Observable<Faction[]>;

  // TODO move to service
  private static validateDeck(deck:Deck):string {
    // validate agenda XOR secondary faction
    if (+deck.agendaId && deck.secondFactionId) {
      return 'pick one';
    }
    // validate banner is not the same as main faction
    if (+deck.agendaId === +deck.factionId) {
      return 'invalid banner';
    }
    // validate faction 1 != faction 2
    if (+deck.factionId === +deck.secondFactionId) {
      return 'invalid second faction';
    }
    return null;
  }

  constructor(private _formBuilder:FormBuilder,
              private _referenceDataService:ReferenceDataService,
              private _notificationService:NotificationService) {
    // TODO probably async
    this.factions = this._referenceDataService.factions;
    this.agendas = this._referenceDataService.agendas;
  }

  ngOnInit() {
    // TODO can't edit imported/saved decks when creating game
    if (this.creating || this.deck.deckId) {
      this.deck = new Deck();
    }
    this.populateForm();
  }

  onDeckClassChange() {
    this.setDefaultTitle();
  }

  onSubmit() {
    // form properties default to strings
    const updatedDeck:Deck = this.deckForm.value;
    //TODO proper validation here
    const error = DeckEditFormComponent.validateDeck(updatedDeck);
    if (error) {
      this._notificationService.warn('Nope', error);
      console.warn(error);
      return;
    }

    Object.assign(this.deck, updatedDeck);
    this.populateDeck(this.deck);
    console.log(this.deck);
    this.updateDeck.emit(this.deck);
  }

  private populateForm() {
    let factionId = this.deck.factionId || '';
    let agendaId = this.deck.agendaId || '';
    let secondFactionId = this.deck.secondFactionId || '';
    let title = this.deck.title || this.deck.fallbackTitle || '';
    let thronesDbLink = this.deck.thronesDbLink || '';
    this.deckForm = this._formBuilder.group({
      factionId: [factionId, Validators.required],
      agendaId: [agendaId],
      secondFactionId: [secondFactionId],
      title: [title, Validators.required],
      thronesDbLink: [thronesDbLink],
    });
  };

  private setDefaultTitle() {
    const title:Control = <Control>this.deckForm.controls['title'];
    if (!title.value || !title.touched) {
      const factionId:number = +this.deckForm.controls['factionId'].value;
      const agendaId:number = +this.deckForm.controls['agendaId'].value;
      const faction = this._referenceDataService.getFaction(factionId);
      const agenda = this._referenceDataService.getAgenda(agendaId);
      const deckClassTitle = DeckClass.getDeckClassTitle(faction, agenda);
      const defaultTitle = `New ${deckClassTitle} deck`;
      title.updateValue(defaultTitle);
    }
  }

  private populateDeck(gamePlayer:Deck) {
    // form properties default to strings
    gamePlayer.faction = this._referenceDataService.getFaction(+gamePlayer.factionId);
    if (gamePlayer.agendaId) {
      gamePlayer.agenda = this._referenceDataService.getAgenda(+gamePlayer.agendaId);
    } else {
      gamePlayer.agenda = null;
    }
    if (gamePlayer.secondFactionId) {
      gamePlayer.secondaryFaction = this._referenceDataService.getFaction(+gamePlayer.secondFactionId);
    } else {
      gamePlayer.secondaryFaction = null;
    }
  }
}
