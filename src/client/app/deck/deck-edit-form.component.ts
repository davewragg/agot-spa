import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { NotificationService } from '../shared/services/notification.service';
import { Agenda } from '../shared/models/agenda.model';
import { Faction } from '../shared/models/faction.model';
import { Deck } from '../shared/models/deck.model';
import { DeckClass } from '../shared/models/deck-class.model';
import { DeckService } from '../shared/services/deck.service';
import * as fromRoot from '../state-management/reducers/root';
import * as deckActions from '../state-management/actions/deck';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-edit-form',
  templateUrl: 'deck-edit-form.component.html'
})
export class DeckEditFormComponent implements OnInit, OnDestroy {
  @Input()
  creating: boolean;
  @Input()
  editing: boolean;

  @Input()
  set deck(deck: Deck) {
    if (deck) {
      this._deck = deck;
      this.deckForm.patchValue(deck);
    }
  }

  // TODO bin this
  _deck: Deck;

  @Output()
  updateDeck: EventEmitter<Deck> = new EventEmitter<Deck>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  deckForm: FormGroup = new FormGroup({
    factionId: new FormControl(['', Validators.required]),
    agendaId: new FormControl(''),
    title: new FormControl(['', Validators.required]),
    thronesDbLink: new FormControl(''),
  });

  agendas$: Observable<Agenda[]>;
  factions$: Observable<Faction[]>;
  refDataLoading$: Observable<boolean>;
  formDirty$: Observable<boolean>;

  cancelling: boolean = false;

  _factions: { [id: string]: Faction };
  _agendas: { [id: string]: Agenda };

  private changesSub: any;

  constructor(private store: Store<fromRoot.State>,
              private _notificationService: NotificationService) {
    this.factions$ = store.select(fromRoot.getFactionsList);
    this.agendas$ = store.select(fromRoot.getAgendasList);
    this.refDataLoading$ = store.select(fromRoot.getRefDataLoading);
    this.formDirty$ = store.select(fromRoot.getDeckForEditDirty);

    store.select(fromRoot.getFactions).subscribe((factions) => this._factions = factions);
    store.select(fromRoot.getAgendas).subscribe((agendas) => this._agendas = agendas);
  }

  ngOnInit() {
    this.changesSub = this.deckForm.valueChanges.subscribe((changes) => {
      // TODO dispatch changes only
      const updatedDeck: Deck = Deck.patchValues(this._deck, changes);
      this.store.dispatch(new deckActions.UpdateAction(updatedDeck));
    });
  }

  ngOnDestroy(): void {
    this.changesSub.unsubscribe();
  }

  onDeckClassChange() {
    this.setDefaultTitle();
  }

  // TODO no force param?
  onCancel() {
    this.cancel.emit(true);
  }

  onSubmit() {
    // TODO dispatch only changes
    const updatedDeck: Deck = Deck.patchValues(this._deck, this.deckForm.value);
    const error = DeckService.validateDeck(updatedDeck);
    if (error) {
      this._notificationService.warn('Nope', error);
      console.warn(error);
      return;
    }

    // TODO move this out to store
    this.populateDeck(updatedDeck);
    this.updateDeck.emit(updatedDeck);
  }

  // TODO move this out to store
  private setDefaultTitle() {
    const title: FormControl = <FormControl>this.deckForm.controls['title'];
    // TODO this might still be wonky, although bot sure exactly when
    if (!title.value || (!title.touched && this.creating)) {
      const factionId: number = +this.deckForm.controls['factionId'].value;
      const agendaId: number = +this.deckForm.controls['agendaId'].value;
      const faction = this.getFaction(factionId);
      const agenda = this.getAgenda(agendaId);
      const deckClassTitle = DeckClass.getDeckClassTitle(faction, agenda);
      const defaultTitle = `New ${deckClassTitle} deck`;
      title.setValue(defaultTitle);
    }
  }

  // TODO move this out to store
  private populateDeck(deck: Deck) {
    deck.faction = this.getFaction(deck.factionId);
    deck.agenda = deck.agendaId ? this.getAgenda(deck.agendaId) : null;
  }

  // TODO move this out to store
  private getFaction(factionId: number | string) {
    return this._factions[factionId];
  }

  // TODO move this out to store
  private getAgenda(agendaId: number | string) {
    return this._agendas[agendaId];
  }
}
