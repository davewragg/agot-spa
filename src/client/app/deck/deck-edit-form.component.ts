import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { NotificationService } from '../shared/services/notification.service';
import { Agenda } from '../shared/models/agenda.model';
import { Faction } from '../shared/models/faction.model';
import { Deck } from '../shared/models/deck.model';
import { DeckService } from '../shared/services/deck.service';
import * as fromRoot from '../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-edit-form',
  templateUrl: 'deck-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckEditFormComponent implements OnInit, OnDestroy {
  @Input()
  creating: boolean;
  @Input()
  editing: boolean;

  @Input()
  set deck(deck: Deck) {
    if (deck) {
      this.deckForm.patchValue(deck, { emitEvent: false });
    }
  }

  @Output()
  updateDeck: EventEmitter<Deck> = new EventEmitter<Deck>();
  @Output()
  deckChange: EventEmitter<Deck> = new EventEmitter<Deck>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  deckForm: FormGroup = new FormGroup({
    factionId: new FormControl('', Validators.required),
    agendaId: new FormControl(''),
    title: new FormControl('', Validators.required),
    thronesDbLink: new FormControl(''),
  });

  agendas$: Observable<Agenda[]>;
  factions$: Observable<Faction[]>;
  refDataLoading$: Observable<boolean>;

  cancelling: boolean = false;

  private changesSub: any;

  constructor(private store: Store<fromRoot.State>,
              private _notificationService: NotificationService) {
    this.factions$ = store.select(fromRoot.getFactionsList);
    this.agendas$ = store.select(fromRoot.getAgendasList);
    this.refDataLoading$ = store.select(fromRoot.getRefDataLoading);
  }

  ngOnInit() {
    this.changesSub = this.deckForm.valueChanges
      .debounceTime(100)
      .subscribe((changes) => this.deckChange.emit(changes));
  }

  ngOnDestroy(): void {
    this.changesSub.unsubscribe();
  }

  // TODO no force param?
  onCancel() {
    this.cancel.emit(true);
  }

  onSubmit() {
    const deckValues = this.deckForm.value;
    const error = DeckService.validateDeck(deckValues);
    if (error) {
      this._notificationService.warn('Nope', error);
      console.warn(error);
      return;
    }

    this.updateDeck.emit(deckValues);
  }
}
