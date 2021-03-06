import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReferenceDataService } from '../shared/services/reference-data.service';
import { NotificationService } from '../shared/services/notification.service';
import { Agenda } from '../shared/models/agenda.model';
import { Faction } from '../shared/models/faction.model';
import { Deck } from '../shared/models/deck.model';
import { DeckClass } from '../shared/models/deck-class.model';
import { Observable } from 'rxjs/Observable';
import { DeckService } from '../shared/services/deck.service';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-edit-form',
  templateUrl: 'deck-edit-form.component.html'
})
export class DeckEditFormComponent implements OnInit {
  @Input()
  creating: boolean;
  @Input()
  editing: boolean;
  @Input()
  deck: Deck;
  @Output()
  updateDeck: EventEmitter<Deck> = new EventEmitter<Deck>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  deckForm: FormGroup;

  agendas: Observable<Agenda[]>;
  factions: Observable<Faction[]>;

  showMore: boolean = false;
  cancelling: boolean = false;

  // TODO legacy sticking plaster
  _factions: Faction[];
  _agendas: Agenda[];

  constructor(private _formBuilder: FormBuilder,
              private _referenceDataService: ReferenceDataService,
              private _notificationService: NotificationService) {
    this.factions = this._referenceDataService.factions;
    this.agendas = this._referenceDataService.agendas;
    // TODO legacy sticking plaster
    this.factions.subscribe((factions) => this._factions = factions);
    this.agendas.subscribe((agendas) => this._agendas = agendas);
  }

  ngOnInit() {
    this.showMore = this.editing;
    // can't edit imported/saved decks when creating game
    if (this.creating || (this.deck.deckId && !this.editing)) {
      this.deck = new Deck();
    }
    this.populateForm();
  }

  onDeckClassChange() {
    this.setDefaultTitle();
  }

  // TODO no force param?
  onCancel() {
    this.cancel.emit(true);
  }

  onSubmit() {
    // form properties default to strings
    const updatedDeck: Deck = this.deckForm.value;
    const error = DeckService.validateDeck(updatedDeck);
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
    let title = this.deck.title || this.deck.fallbackTitle || '';
    let thronesDbLink = this.deck.thronesDbLink || '';
    this.deckForm = this._formBuilder.group({
      factionId: [factionId, Validators.required],
      agendaId: [agendaId],
      title: [title, Validators.required],
      thronesDbLink: [thronesDbLink],
    });
  };

  private setDefaultTitle() {
    const title: FormControl = <FormControl>this.deckForm.controls['title'];
    if (!title.value || (!title.touched && this.creating)) {
      const factionId: number = +this.deckForm.controls['factionId'].value;
      const agendaId: number = +this.deckForm.controls['agendaId'].value;
      const faction = this.getFaction(factionId);
      const agenda = this.getAgenda(agendaId);
      const deckClassTitle = DeckClass.getDeckClassTitle(faction, agenda);
      const defaultTitle = `New ${deckClassTitle} deck`;
      title.setValue(defaultTitle, {});// TODO check {}
    }
  }

  private populateDeck(gamePlayer: Deck) {
    // form properties default to strings
    gamePlayer.faction = this.getFaction(+gamePlayer.factionId);
    if (gamePlayer.agendaId) {
      gamePlayer.agenda = this.getAgenda(+gamePlayer.agendaId);
    } else {
      gamePlayer.agenda = null;
    }
  }

  // TODO legacy sticking plaster
  private getFaction(factionId: number | string) {
    return this._factions.find((faction) => faction.factionId === +factionId);
  }

  // TODO legacy sticking plaster
  private getAgenda(agendaId: number | string) {
    return this._agendas.find((agenda) => agenda.agendaId === +agendaId);
  }
}
