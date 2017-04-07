import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Deck } from '../shared/models/deck.model';
import * as fromRoot from '../state-management/reducers/root';
import * as thronesDbActions from '../state-management/actions/thrones-db';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-import-form',
  templateUrl: 'deck-import-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckImportFormComponent {
  @Input()
  creating: boolean;
  @Output()
  updateDeck: EventEmitter<Deck> = new EventEmitter<Deck>();

  importForm: FormGroup = new FormGroup({
    thronesDbId: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]+')])),
  });

  importedDeck$: Observable<Deck>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.importedDeck$ = store.select(fromRoot.getImportedDeck);
    this.loading$ = store.select(fromRoot.getImportedDeckLoading);
  }

  onSubmit() {
    // new properties default to strings
    const thronesDbId: number = +this.importForm.controls['thronesDbId'].value;
    this.store.dispatch(new thronesDbActions.ImportDeckAction(thronesDbId));
  }

  onDeckSelect() {
    let importedDeck: Deck;
    this.importedDeck$.subscribe(x => importedDeck = x);
    this.updateDeck.emit(importedDeck);
  }
}
