import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, ControlGroup, Validators } from '@angular/common';
import { Deck } from '../shared/models/deck.model';
import { ThronesDbService } from '../shared/services/thrones-db.service';

@Component({
  selector: 'agot-deck-import-form',
  templateUrl: 'decks/deck-import-form.component.html',
  // directives: [SpinnerComponent, DeckClassBlockComponent]
})
export class DeckImportFormComponent implements OnInit {
  @Input()
  creating: boolean;
  @Output()
  updateDeck: EventEmitter<Deck> = new EventEmitter<Deck>();

  importForm: ControlGroup;
  importedDeck: Deck;
  isImporting: boolean;
  importError: any;

  constructor(private _formBuilder: FormBuilder,
              private thronesDbService: ThronesDbService) {
  }

  ngOnInit() {
    this.populateForm();
  }

  onSubmit() {
    // new properties default to strings
    const thronesDbId: number = +this.importForm.controls['thronesDbId'].value;

    console.log(thronesDbId);
    this.isImporting = true;
    this.importError = null;
    this.thronesDbService.importAndConvertThronesDbDeck(thronesDbId).subscribe(
      (deck: Deck) => {
        if (!deck) {
          this.importError = 'Not found';
        } else {
          this.importedDeck = deck;
        }
        // may not trigger complete?
        this.isImporting = false;
      },
      (error) => {
        console.error(error);
        this.importError = `Couldn't load deck. Please check the id and try again.`;
        this.isImporting = false;
      },
      () => this.isImporting = false
    );
  }

  onDeckSelect() {
    console.log(this.importedDeck);
    this.updateDeck.emit(this.importedDeck);
  }

  private populateForm() {
    let thronesDbId = '';
    this.importForm = this._formBuilder.group({
      thronesDbId: [thronesDbId, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
    });
  };
}
